import { describe, expect, it } from "vitest";
import { normalizeUserOpenId } from "./userIdentity";

describe("normalizeUserOpenId", () => {
  it("prefers the canonical openId field", () => {
    expect(normalizeUserOpenId({ openId: "canonical", id: "fallback" })).toBe("canonical");
  });

  it("accepts standard provider fallbacks", () => {
    expect(normalizeUserOpenId({ id: "provider-id" })).toBe("provider-id");
    expect(normalizeUserOpenId({ sub: "provider-sub" })).toBe("provider-sub");
    expect(normalizeUserOpenId({ identifier: "provider-identifier" })).toBe("provider-identifier");
  });

  it("unwraps nested profile payloads", () => {
    expect(normalizeUserOpenId({ profile: { sub: "nested-sub" } })).toBe("nested-sub");
    expect(normalizeUserOpenId({ data: { user: { id: "deep-id" } } })).toBe("deep-id");
    expect(normalizeUserOpenId({ user: { identifier: "nested-identifier" } })).toBe("nested-identifier");
  });

  it("rejects empty or unsupported payloads", () => {
    expect(normalizeUserOpenId({ openId: "   " })).toBeUndefined();
    expect(normalizeUserOpenId(null)).toBeUndefined();
    expect(normalizeUserOpenId({ email: "user@example.com" })).toBeUndefined();
  });
});
