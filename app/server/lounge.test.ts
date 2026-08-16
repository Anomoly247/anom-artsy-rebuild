import { describe, expect, it } from "vitest";
import { getUserLounges } from "./db";

describe("lounge db helper regression", () => {
  it("successfully queries user lounges without missing column errors", async () => {
    const loungesList = await getUserLounges(1);
    expect(Array.isArray(loungesList)).toBe(true);
  });
});
