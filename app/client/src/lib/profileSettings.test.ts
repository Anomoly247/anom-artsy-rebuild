import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  loadProfileSettings,
  saveProfileSettings,
  updateProfileSetting,
  updateColors,
  addProfilePhoto,
  updatePhotoSets,
  removeProfilePhoto,
  getActiveProfileImage,
  getActiveBackgroundImage,
  generateShareableProfileUrl,
  decodeShareableProfileData,
  createIdentitySyncCode,
  applyIdentitySyncCode,
  clearProfileSettings,
  type ProfileSettings,
  type ProfilePhoto,
} from "./profileSettings";

describe("Profile Settings Persistence", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("loadProfileSettings", () => {
    it("should return default settings when localStorage is empty", () => {
      const settings = loadProfileSettings();
      expect(settings.colors.primary).toBe("#ff00cc");
      expect(settings.colors.secondary).toBe("#00eaff");
      expect(settings.theme).toBe("dark");
      expect(settings.photos).toEqual([]);
    });

    it("should load saved settings from localStorage", () => {
      const customSettings: ProfileSettings = {
        colors: { primary: "#ffffff", secondary: "#000000", accent: "#cccccc" },
        theme: "light" as const,
        bio: "Test bio",
        nameColor: "#ffffff",
        photos: [],
      };
      localStorage.setItem("anom_profile_settings", JSON.stringify(customSettings));

      const loaded = loadProfileSettings();
      expect(loaded.colors.primary).toBe("#ffffff");
      expect(loaded.theme).toBe("light");
      expect(loaded.bio).toBe("Test bio");
    });
  });

  describe("saveProfileSettings", () => {
    it("should save settings to localStorage", () => {
      const settings: ProfileSettings = {
        colors: { primary: "#ff00cc", secondary: "#00eaff", accent: "#ffd700" },
        theme: "dark",
        bio: "My bio",
        nameColor: "#ff00cc",
        photos: [],
      };

      saveProfileSettings(settings);
      const stored = localStorage.getItem("anom_profile_settings");
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!).bio).toBe("My bio");
    });
  });

  describe("updateProfileSetting", () => {
    it("should update a specific setting", () => {
      const updated = updateProfileSetting("bio", "Updated bio");
      expect(updated.bio).toBe("Updated bio");

      const loaded = loadProfileSettings();
      expect(loaded.bio).toBe("Updated bio");
    });

    it("should preserve other settings when updating one", () => {
      const initial = loadProfileSettings();
      initial.colors.primary = "#111111";
      saveProfileSettings(initial);

      updateProfileSetting("bio", "New bio");
      const loaded = loadProfileSettings();
      expect(loaded.colors.primary).toBe("#111111");
      expect(loaded.bio).toBe("New bio");
    });
  });

  describe("updateColors", () => {
    it("should update color settings", () => {
      const updated = updateColors({
        primary: "#123456",
        secondary: "#654321",
      });

      expect(updated.colors.primary).toBe("#123456");
      expect(updated.colors.secondary).toBe("#654321");
      expect(updated.colors.accent).toBe("#ffd700"); // Should remain unchanged
    });
  });

  describe("Photo Management", () => {
    it("should add a new photo", () => {
      const photo: ProfilePhoto = {
        id: "photo_1",
        url: "data:image/png;base64,test",
        uploadedAt: Date.now(),
        sets: {
          isProfileImage: true,
          isBackgroundImage: false,
          isDefault: false,
        },
      };

      const updated = addProfilePhoto(photo);
      expect(updated.photos).toHaveLength(1);
      expect(updated.photos[0].id).toBe("photo_1");
    });

    it("should update photo sets", () => {
      const photo: ProfilePhoto = {
        id: "photo_1",
        url: "data:image/png;base64,test",
        uploadedAt: Date.now(),
        sets: {
          isProfileImage: false,
          isBackgroundImage: false,
          isDefault: false,
        },
      };

      addProfilePhoto(photo);
      const updated = updatePhotoSets("photo_1", { isProfileImage: true });

      expect(updated.photos[0].sets.isProfileImage).toBe(true);
      expect(updated.activeProfileImage).toBe("photo_1");
    });

    it("should remove a photo", () => {
      const photo: ProfilePhoto = {
        id: "photo_1",
        url: "data:image/png;base64,test",
        uploadedAt: Date.now(),
        sets: {
          isProfileImage: true,
          isBackgroundImage: false,
          isDefault: false,
        },
      };

      addProfilePhoto(photo);
      const updated = removeProfilePhoto("photo_1");

      expect(updated.photos).toHaveLength(0);
      expect(updated.activeProfileImage).toBeUndefined();
    });

    it("should get active profile image", () => {
      const photo: ProfilePhoto = {
        id: "photo_1",
        url: "data:image/png;base64,test",
        uploadedAt: Date.now(),
        sets: {
          isProfileImage: true,
          isBackgroundImage: false,
          isDefault: false,
        },
      };

      addProfilePhoto(photo);
      const active = getActiveProfileImage();

      expect(active).toBeTruthy();
      expect(active?.id).toBe("photo_1");
    });

    it("should get active background image", () => {
      const photo: ProfilePhoto = {
        id: "photo_2",
        url: "data:image/png;base64,test",
        uploadedAt: Date.now(),
        sets: {
          isProfileImage: false,
          isBackgroundImage: true,
          isDefault: false,
        },
      };

      addProfilePhoto(photo);
      const active = getActiveBackgroundImage();

      expect(active).toBeTruthy();
      expect(active?.id).toBe("photo_2");
    });
  });

  describe("Sharing & Sync", () => {
    it("should generate shareable profile URL", () => {
      const url = generateShareableProfileUrl("https://example.com");
      expect(url).toContain("https://example.com/profile/share?data=");
    });

    it("should decode shareable profile data", () => {
      const settings = loadProfileSettings();
      settings.bio = "Test bio";
      saveProfileSettings(settings);

      const url = generateShareableProfileUrl();
      const encoded = url.split("data=")[1];
      const decoded = decodeShareableProfileData(encoded);

      expect(decoded).toBeTruthy();
      expect(decoded?.bio).toBe("Test bio");
    });

    it("should create identity sync code", () => {
      const code = createIdentitySyncCode();
      expect(code).toBeTruthy();
      expect(typeof code).toBe("string");
    });

    it("should apply identity sync code", () => {
      const code = createIdentitySyncCode();
      
      // Modify settings
      updateColors({ primary: "#111111" });

      // Apply sync code (should restore original colors)
      const success = applyIdentitySyncCode(code);
      expect(success).toBe(true);
    });

    it("should handle invalid sync code gracefully", () => {
      const success = applyIdentitySyncCode("invalid_code");
      expect(success).toBe(false);
    });
  });

  describe("clearProfileSettings", () => {
    it("should clear all settings from localStorage", () => {
      const settings = loadProfileSettings();
      settings.bio = "Test";
      saveProfileSettings(settings);

      clearProfileSettings();
      const cleared = loadProfileSettings();

      expect(cleared.bio).toBe("");
    });
  });
});
