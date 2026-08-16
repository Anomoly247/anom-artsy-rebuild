import { describe, expect, it } from "vitest";
import {
  OAUTH_STATE_COOKIE,
  decodeOAuthState,
  encodeOAuthState,
} from "../shared/const";

describe("OAuth state contract", () => {
  it("round-trips the redirect URI and one-time nonce used by the callback", () => {
    const state = encodeOAuthState({
      redirectUri: "https://example.test/api/oauth/callback",
      nonce: "nonce-for-regression-test",
    });

    expect(decodeOAuthState(state)).toEqual({
      redirectUri: "https://example.test/api/oauth/callback",
      nonce: "nonce-for-regression-test",
    });
    expect(OAUTH_STATE_COOKIE).toBe("__Host-oauth_state");
  });

  it("rejects malformed OAuth state instead of silently accepting it", () => {
    expect(() => decodeOAuthState("not-valid-base64-json")).toThrow(
      "Invalid OAuth state",
    );
  });
});
