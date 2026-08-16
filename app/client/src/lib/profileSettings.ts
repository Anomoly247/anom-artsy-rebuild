/**
 * Profile Settings Persistence Service
 * Handles localStorage persistence for profile settings, colors, and photos
 */

export interface ProfilePhoto {
  id: string;
  url: string;
  uploadedAt: number;
  sets: {
    isProfileImage: boolean;
    isBackgroundImage: boolean;
    isDefault: boolean;
  };
}

export interface ProfileSettings {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  theme: "light" | "dark";
  bio: string;
  nameColor: string;
  photos: ProfilePhoto[];
  activeProfileImage?: string;
  activeBackgroundImage?: string;
}

const STORAGE_KEY = "anom_profile_settings";
const PHOTOS_STORAGE_KEY = "anom_profile_photos";

// Default settings
const DEFAULT_SETTINGS: ProfileSettings = {
  colors: {
    primary: "#ff00cc",
    secondary: "#00eaff",
    accent: "#ffd700",
  },
  theme: "dark",
  bio: "",
  nameColor: "#ff00cc",
  photos: [],
};

/**
 * Load profile settings from localStorage
 */
export function loadProfileSettings(): ProfileSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error("Failed to load profile settings:", error);
  }
  return DEFAULT_SETTINGS;
}

/**
 * Save profile settings to localStorage
 */
export function saveProfileSettings(settings: ProfileSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save profile settings:", error);
  }
}

/**
 * Update specific profile setting
 */
export function updateProfileSetting<K extends keyof ProfileSettings>(
  key: K,
  value: ProfileSettings[K]
): ProfileSettings {
  const settings = loadProfileSettings();
  settings[key] = value;
  saveProfileSettings(settings);
  return settings;
}

/**
 * Update color settings
 */
export function updateColors(colors: Partial<ProfileSettings["colors"]>): ProfileSettings {
  const settings = loadProfileSettings();
  settings.colors = { ...settings.colors, ...colors };
  saveProfileSettings(settings);
  return settings;
}

/**
 * Add a new photo to profile
 */
export function addProfilePhoto(photo: ProfilePhoto): ProfileSettings {
  const settings = loadProfileSettings();
  settings.photos = [...settings.photos, photo];
  saveProfileSettings(settings);
  return settings;
}

/**
 * Update photo sets (which role the photo plays)
 */
export function updatePhotoSets(
  photoId: string,
  sets: Partial<ProfilePhoto["sets"]>
): ProfileSettings {
  const settings = loadProfileSettings();
  const photo = settings.photos.find((p) => p.id === photoId);

  if (photo) {
    photo.sets = { ...photo.sets, ...sets };

    // If setting as profile image, unset others
    if (sets.isProfileImage) {
      settings.activeProfileImage = photoId;
      settings.photos.forEach((p) => {
        if (p.id !== photoId) p.sets.isProfileImage = false;
      });
    }

    // If setting as background image, unset others
    if (sets.isBackgroundImage) {
      settings.activeBackgroundImage = photoId;
      settings.photos.forEach((p) => {
        if (p.id !== photoId) p.sets.isBackgroundImage = false;
      });
    }

    saveProfileSettings(settings);
  }

  return settings;
}

/**
 * Remove a photo from profile
 */
export function removeProfilePhoto(photoId: string): ProfileSettings {
  const settings = loadProfileSettings();
  settings.photos = settings.photos.filter((p) => p.id !== photoId);

  // Clear active references if needed
  if (settings.activeProfileImage === photoId) {
    settings.activeProfileImage = undefined;
  }
  if (settings.activeBackgroundImage === photoId) {
    settings.activeBackgroundImage = undefined;
  }

  saveProfileSettings(settings);
  return settings;
}

/**
 * Get active profile image
 */
export function getActiveProfileImage(): ProfilePhoto | undefined {
  const settings = loadProfileSettings();
  if (settings.activeProfileImage) {
    return settings.photos.find((p) => p.id === settings.activeProfileImage);
  }
  return undefined;
}

/**
 * Get active background image
 */
export function getActiveBackgroundImage(): ProfilePhoto | undefined {
  const settings = loadProfileSettings();
  if (settings.activeBackgroundImage) {
    return settings.photos.find((p) => p.id === settings.activeBackgroundImage);
  }
  return undefined;
}

/**
 * Generate shareable profile URL
 */
export function generateShareableProfileUrl(baseUrl: string = window.location.origin): string {
  const settings = loadProfileSettings();
  const encodedSettings = btoa(JSON.stringify(settings));
  return `${baseUrl}/profile/share?data=${encodedSettings}`;
}

/**
 * Decode shareable profile data
 */
export function decodeShareableProfileData(encodedData: string): ProfileSettings | null {
  try {
    const decoded = atob(encodedData);
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Failed to decode shareable profile data:", error);
    return null;
  }
}

/**
 * Export profile as JSON for backup
 */
export function exportProfileAsJSON(): string {
  const settings = loadProfileSettings();
  return JSON.stringify(settings, null, 2);
}

/**
 * Import profile from JSON
 */
export function importProfileFromJSON(jsonData: string): ProfileSettings | null {
  try {
    const imported = JSON.parse(jsonData);
    saveProfileSettings(imported);
    return imported;
  } catch (error) {
    console.error("Failed to import profile:", error);
    return null;
  }
}

/**
 * Clear all profile settings
 */
export function clearProfileSettings(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Create identity sync code for sharing
 */
export function createIdentitySyncCode(): string {
  const settings = loadProfileSettings();
  const code = btoa(JSON.stringify({
    colors: settings.colors,
    nameColor: settings.nameColor,
    theme: settings.theme,
    timestamp: Date.now(),
  }));
  return code;
}

/**
 * Apply identity sync code
 */
export function applyIdentitySyncCode(code: string): boolean {
  try {
    const decoded = JSON.parse(atob(code));
    const settings = loadProfileSettings();
    settings.colors = decoded.colors;
    settings.nameColor = decoded.nameColor;
    settings.theme = decoded.theme;
    saveProfileSettings(settings);
    return true;
  } catch (error) {
    console.error("Failed to apply identity sync code:", error);
    return false;
  }
}
