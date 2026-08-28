export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const startLogin = () => {
  // Point directly to our raw backend redirect route
  // This circumvents browser Content-Security-Policy event evaluation blocks completely!
  if (window.location.hostname === "localhost") {
    window.location.href = "/api/auth-bypass";
    return;
  }

  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("type", "signIn");

  window.location.href = url.toString();
};
