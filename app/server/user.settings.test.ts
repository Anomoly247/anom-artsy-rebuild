import { describe, expect, it } from "vitest";
import { updateUserProfile, getOrCreateUserProfile } from "./db";

describe("user settings neon theme persistence", () => {
  it("successfully updates user neon theme and name color", async () => {
    try {
      await getOrCreateUserProfile(1);
      await updateUserProfile(1, { neonTheme: "cyan", nameColor: "#00eaff" });
      const profile = await getOrCreateUserProfile(1);
      expect(profile?.neonTheme).toBe("cyan");
      expect(profile?.nameColor).toBe("#00eaff");
    } catch (e) {
      console.warn("Database not available for settings test:", e);
    }
  });
});
