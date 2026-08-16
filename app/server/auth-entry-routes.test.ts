import { describe, expect, it } from "vitest";
import { AUTH_ENTRY_ROUTES } from "../client/src/authEntryRoutes";

describe("authentication entry routes", () => {
  it("keeps every supported sign-in alias available to the client router", () => {
    expect(AUTH_ENTRY_ROUTES).toEqual(["/login", "/sign-in", "/signin"]);
  });
});
