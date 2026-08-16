import { describe, expect, it } from "vitest";
import { shouldServeSpaFallback } from "./vite";

describe("SPA fallback routing", () => {
  it("never serves the frontend shell for API and OAuth routes", () => {
    expect(shouldServeSpaFallback("/api/oauth/callback")).toBe(false);
    expect(shouldServeSpaFallback("/api/oauth/login")).toBe(false);
    expect(shouldServeSpaFallback("/api/trpc/auth.me")).toBe(false);
  });

  it("continues to serve client-side application routes", () => {
    expect(shouldServeSpaFallback("/")).toBe(true);
    expect(shouldServeSpaFallback("/owner")).toBe(true);
    expect(shouldServeSpaFallback("/dashboard")).toBe(true);
  });
});
