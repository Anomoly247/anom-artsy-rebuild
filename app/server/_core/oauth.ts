import { COOKIE_NAME, ONE_YEAR_MS, OAUTH_STATE_COOKIE, decodeOAuthState, encodeOAuthState } from "@shared/const";
import { timingSafeEqual } from "node:crypto";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { parse as parseCookieHeader } from "cookie";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { sdk } from "./sdk";
import { normalizeUserOpenId } from "./userIdentity";

export const POST_LOGIN_REDIRECT = "/dashboard";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

function getRequestOrigin(req: Request) {
  const host = req.headers["x-forwarded-host"] ?? req.get("host");
  if (!host || Array.isArray(host)) return undefined;

  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = typeof forwardedProto === "string"
    ? forwardedProto.split(",")[0]?.trim()
    : req.protocol;

  return `${protocol === "https" ? "https" : "http"}://${host}`;
}

function adminLoginKeyMatches(req: Request): boolean {
  const suppliedKey = (typeof req.query.key === "string"
    ? req.query.key
    : req.header("x-admin-login-key"))?.trim();
  const configuredKey = ENV.adminLoginKey.trim();
  if (!suppliedKey || !configuredKey) return false;

  const supplied = Buffer.from(suppliedKey, "utf8");
  const configured = Buffer.from(configuredKey, "utf8");
  return supplied.length === configured.length && timingSafeEqual(supplied, configured);
}

const adminLoginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many admin login attempts. Try again later." },
  keyGenerator: (req) => ipKeyGenerator(req.ip ?? req.socket.remoteAddress ?? "unknown"),
});

async function establishAdminSession(req: Request, res: Response) {
  const openId = ENV.devAuthUserId;
  const name = ENV.devAuthUserName;
  const email = ENV.adminEmail;
  await db.upsertUser({
    openId,
    name,
    email,
    loginMethod: "admin-key",
    role: "admin",
    lastSignedIn: new Date(),
  });
  const sessionToken = await sdk.createSessionToken(openId, {
    name,
    expiresInMs: ONE_YEAR_MS,
  });
  res.cookie(COOKIE_NAME, sessionToken, {
    ...getSessionCookieOptions(req),
    maxAge: ONE_YEAR_MS,
  });
  res.redirect(302, "/admin");
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/admin-login", adminLoginRateLimit, async (req: Request, res: Response) => {
    if (!ENV.adminLoginKey) {
      res.status(503).json({ error: "Admin login is not configured" });
      return;
    }
    if (!adminLoginKeyMatches(req)) {
      res.status(401).json({ error: "Invalid admin login key" });
      return;
    }
    try {
      await establishAdminSession(req, res);
    } catch (error) {
      console.error("[Admin Auth] Login failed", error);
      res.status(500).json({ error: "Admin login failed" });
    }
  });

  // The frontend sends users here for Google-backed platform OAuth. Register it
  // before the SPA fallback so an unavailable or misconfigured OAuth service
  // always returns a server response rather than index.html.
  app.get("/api/auth/google", async (req: Request, res: Response) => {
    if ((!ENV.oAuthServerUrl || !ENV.appId) && ENV.devAuthBypass) {
      if (!ENV.cookieSecret) {
        res.status(503).json({ error: "DEV_AUTH_BYPASS requires JWT_SECRET" });
        return;
      }

      const userOpenId = ENV.devAuthUserId;
      const userName = ENV.devAuthUserName;
      const userEmail = ENV.devAuthUserEmail;
      await db.upsertUser({
        openId: userOpenId,
        name: userName,
        email: userEmail,
        loginMethod: "development",
        role: "admin",
        lastSignedIn: new Date(),
      });
      const sessionToken = await sdk.createSessionToken(userOpenId, {
        name: userName,
        expiresInMs: ONE_YEAR_MS,
      });
      res.cookie(COOKIE_NAME, sessionToken, {
        ...getSessionCookieOptions(req),
        maxAge: ONE_YEAR_MS,
      });
      res.redirect(302, "/admin");
      return;
    }

    if (!ENV.oAuthServerUrl || !ENV.appId) {
      res.status(503).json({ error: "Google OAuth is not configured" });
      return;
    }

    const origin = getRequestOrigin(req);
    if (!origin) {
      res.status(400).json({ error: "Unable to determine OAuth callback origin" });
      return;
    }

    const nonce = crypto.randomUUID();
    const redirectUri = `${origin}/api/oauth/callback`;
    const state = encodeOAuthState({ redirectUri, nonce });
    const cookieOptions = getSessionCookieOptions(req);

    res.cookie(OAUTH_STATE_COOKIE, nonce, {
      ...cookieOptions,
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });
    res.setHeader("Cache-Control", "no-store");

    const oauthUrl = new URL("/app-auth", ENV.oAuthServerUrl);
    oauthUrl.searchParams.set("appId", ENV.appId);
    oauthUrl.searchParams.set("redirectUri", redirectUri);
    oauthUrl.searchParams.set("state", state);
    oauthUrl.searchParams.set("type", "signIn");
    res.redirect(302, oauthUrl.toString());
  });

  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    // CSRF guard: the nonce in `state` must match the one-time cookie that
    // startLogin set in the browser that began this login. An attacker can
    // forge `state`, but cannot plant this cookie in the victim's browser.
    const { nonce } = decodeOAuthState(state);
    const expectedNonce = parseCookieHeader(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
    if (!nonce || nonce !== expectedNonce) {
      res.status(403).json({ error: "invalid oauth state" });
      return;
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/", secure: true, sameSite: "none" });

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      const userOpenId = normalizeUserOpenId(userInfo);

      if (!userOpenId) {
        res.redirect(302, "/login?error=identifier");
        return;
      }

      const normalizedEmail = userInfo.email?.trim().toLowerCase();
      const isAdmin = normalizedEmail === ENV.adminEmail;
      const role = isAdmin ? "admin" : undefined;
      await db.upsertUser({
        openId: userOpenId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        role,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userOpenId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, isAdmin ? "/admin" : POST_LOGIN_REDIRECT);
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      const message = error instanceof Error ? error.message : "";
      const errorCode = /database|table|connection|transport|upsert/i.test(message)
        ? "database"
        : "callback";
      res.redirect(302, `/login?error=${errorCode}`);
    }
  });
}
