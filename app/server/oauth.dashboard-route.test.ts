import { describe, expect, it } from "vitest";
import { POST_LOGIN_REDIRECT } from "./_core/oauth";

describe("unified Homeworld OAuth routing", () => {
  it("sends successful member sign-ins to the dashboard mount instead of the static root", () => {
    expect(POST_LOGIN_REDIRECT).toBe("/dashboard");
  });
});
