import { Request, Response, Express } from "express";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export function registerAuthBypass(app: Express) {
  app.get("/api/auth-bypass", async (req: Request, res: Response) => {
    // Generate an absolute local session token that satisfies the backend authorization checks
    const mockSessionToken = "manus-session=mock-dev-admin-session";
    
    // Set your cookies natively from the backend header layer (bypassing browser script blocks)
    res.cookie(COOKIE_NAME, mockSessionToken, {
      path: "/",
      maxAge: ONE_YEAR_MS,
      httpOnly: false,
      secure: false,
      sameSite: "lax"
    });

    // Bounce right back to your pristine store index page logged in!
    res.redirect(302, "/");
  });
}
