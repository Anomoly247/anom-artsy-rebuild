const isProduction = process.env.NODE_ENV === "production";
const devAuthBypass = process.env.NODE_ENV === "development" && process.env.DEV_AUTH_BYPASS === "true";

export const ENV = {
  appId: process.env.VITE_APP_ID || (devAuthBypass ? "dev-local-app" : ""),
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  adminEmail: (process.env.ADMIN_EMAIL ?? "bethmarieshanley6@gmail.com").trim().toLowerCase(),
  isProduction,
  devAuthBypass,
  devAuthUserId: process.env.DEV_AUTH_USER_ID ?? "dev-admin-bethmarieshanley6",
  devAuthUserName: process.env.DEV_AUTH_USER_NAME ?? "Eliza Wood",
  devAuthUserEmail: process.env.DEV_AUTH_USER_EMAIL ?? "bethmarieshanley6@gmail.com",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};
