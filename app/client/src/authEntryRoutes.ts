export const AUTH_ENTRY_ROUTES = ["/login", "/sign-in", "/signin"] as const;

export const GOOGLE_OAUTH_ENTRY = "/api/auth/google";

export function startGoogleLogin() {
  window.location.assign(GOOGLE_OAUTH_ENTRY);
}
