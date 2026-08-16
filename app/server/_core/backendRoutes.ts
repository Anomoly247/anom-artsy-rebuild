import type { Express, Response } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";

/**
 * Registers every server-owned route before any Vite or SPA fallback middleware.
 * Keep the final `/api` handler last within this block so unknown API paths
 * return JSON instead of falling through to the client application shell.
 */
export function registerBackendRoutes(app: Express) {
  registerStorageProxy(app);
  registerOAuthRoutes(app);

  app.get(["/shop", "/shop.html", "/merch", "/lol-shop"], (_req, res) => {
    res.redirect(301, "https://anomartsy.lol");
  });

  const sseClients = new Set<Response>();
  app.get("/api/stream/lounge", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    res.write(`data: ${JSON.stringify({ type: "connected", timestamp: Date.now() })}\n\n`);
    sseClients.add(res);

    const heartbeat = setInterval(() => {
      res.write(`data: ${JSON.stringify({ type: "ping", timestamp: Date.now() })}\n\n`);
    }, 15000);

    req.on("close", () => {
      clearInterval(heartbeat);
      sseClients.delete(res);
    });
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "API route not found" });
  });
}
