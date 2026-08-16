import { updateUserProfile, getOrCreateUserProfile } from "./db";

/**
 * Unified settings persistence service
 * Ensures all settings are saved to both database and client-side
 */

export interface UserSettings {
  bio?: string;
  neonTheme?: "magenta" | "cyan" | "purple";
  nameColor?: string;
  profileLayout?: string;
  isPublic?: boolean;
  decorationPackageIds?: number[];
  profileImageUrl?: string;
  backgroundImageUrl?: string;
}

/**
 * Save user settings to database
 * Ensures profile exists before updating
 */
export async function saveUserSettings(userId: number, settings: UserSettings) {
  try {
    // Ensure profile exists
    await getOrCreateUserProfile(userId);
    
    // Build update object with only non-undefined values
    const updates: Record<string, any> = {};
    
    if (settings.bio !== undefined) updates.bio = settings.bio;
    if (settings.neonTheme !== undefined) updates.neonTheme = settings.neonTheme;
    if (settings.nameColor !== undefined) updates.nameColor = settings.nameColor;
    if (settings.profileLayout !== undefined) updates.profileLayout = settings.profileLayout;
    if (settings.isPublic !== undefined) updates.isPublic = settings.isPublic;
    if (settings.decorationPackageIds !== undefined) updates.decorationPackageIds = settings.decorationPackageIds;
    if (settings.profileImageUrl !== undefined) updates.profileImageUrl = settings.profileImageUrl;
    if (settings.backgroundImageUrl !== undefined) updates.backgroundImageUrl = settings.backgroundImageUrl;
    
    // Update profile
    const updated = await updateUserProfile(userId, updates);
    
    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    console.error("[Settings] Failed to save user settings:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Load user settings from database
 */
export async function loadUserSettings(userId: number) {
  try {
    const profile = await getOrCreateUserProfile(userId);
    
    if (!profile) {
      return {
        success: false,
        error: "Profile not found",
      };
    }
    
    return {
      success: true,
      data: {
        bio: profile.bio || "",
        neonTheme: profile.neonTheme || "magenta",
        nameColor: profile.nameColor || "#ff00cc",
        profileLayout: "default",
        isPublic: true,
        decorationPackageIds: profile.decorationPackageIds || [],
        profileImageUrl: profile.avatarUrl || "",
        backgroundImageUrl: "",
      },
    };
  } catch (error) {
    console.error("[Settings] Failed to load user settings:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Update a single setting field
 */
export async function updateUserSetting(userId: number, field: keyof UserSettings, value: any) {
  try {
    const settings: UserSettings = {};
    settings[field] = value;
    
    return await saveUserSettings(userId, settings);
  } catch (error) {
    console.error(`[Settings] Failed to update ${field}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
