/**
 * Profile Customization Service
 * Manages profile pictures, background images, decorations, and emotes
 */

export interface ProfileCustomization {
  profilePictureUrl?: string;
  backgroundImageUrl?: string;
  bio?: string;
  socialLinks?: Record<string, string>;
  profileLayout?: "compact" | "full" | "showcase";
  isPublic?: boolean;
  decorations?: number[];
  emotes?: string[];
}

export interface LoungeCustomization {
  backgroundImageUrl?: string;
  bannerImageUrl?: string;
  themeColor?: string;
  description?: string;
  welcomeMessage?: string;
  musicTrackId?: string;
  mood?: string;
  visibility?: "public" | "private";
}

export interface ImageUploadOptions {
  maxSize?: number; // in bytes, default 5MB
  allowedFormats?: string[];
  quality?: number; // 0-100
}

export interface DecorationItem {
  id: number;
  name: string;
  category: "badge" | "achievement" | "social_good" | "emote";
  imageUrl: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: Date;
}

/**
 * Validate image upload
 */
export function validateImageUpload(
  file: File,
  options: ImageUploadOptions = {}
): { valid: boolean; error?: string } {
  const maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB default
  const allowedFormats = options.allowedFormats || ["image/jpeg", "image/png", "image/webp"];

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Image size exceeds ${maxSize / 1024 / 1024}MB limit`,
    };
  }

  if (!allowedFormats.includes(file.type)) {
    return {
      valid: false,
      error: `File format not supported. Allowed: ${allowedFormats.join(", ")}`,
    };
  }

  return { valid: true };
}

/**
 * Get decoration categories
 */
export function getDecorationCategories() {
  return [
    {
      id: "badge",
      name: "Badges",
      description: "Character and identity badges",
      icon: "Shield",
    },
    {
      id: "achievement",
      name: "Achievements",
      description: "Earned through gameplay and activities",
      icon: "Trophy",
    },
    {
      id: "social_good",
      name: "Social Good",
      description: "Earned through positive impact",
      icon: "Heart",
    },
    {
      id: "emote",
      name: "Emotes",
      description: "Expressive emojis and animations",
      icon: "Smile",
    },
  ];
}

/**
 * Get rarity colors
 */
export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: "#7a7f8e",
    rare: "#00eaff",
    epic: "#b000ff",
    legendary: "#ffd700",
  };
  return colors[rarity] || colors.common;
}

/**
 * Get rarity badge
 */
export function getRarityBadge(rarity: string): string {
  const badges: Record<string, string> = {
    common: "Common",
    rare: "Rare",
    epic: "Epic",
    legendary: "Legendary ✨",
  };
  return badges[rarity] || "Unknown";
}

/**
 * Generate profile customization preset
 */
export function generateProfilePreset(
  name: string
): ProfileCustomization {
  const presets: Record<string, ProfileCustomization> = {
    neon_magenta: {
      profileLayout: "showcase",
      isPublic: true,
    },
    neon_cyan: {
      profileLayout: "full",
      isPublic: true,
    },
    neon_purple: {
      profileLayout: "compact",
      isPublic: true,
    },
    minimalist: {
      profileLayout: "compact",
      isPublic: false,
    },
  };

  return presets[name] || presets.neon_magenta;
}

/**
 * Generate lounge customization preset
 */
export function generateLoungePreset(
  name: string
): LoungeCustomization {
  const presets: Record<string, LoungeCustomization> = {
    chill_vibes: {
      themeColor: "#00eaff",
      mood: "chill",
      visibility: "public",
    },
    creative_space: {
      themeColor: "#ff00cc",
      mood: "creative",
      visibility: "public",
    },
    focus_zone: {
      themeColor: "#b000ff",
      mood: "focus",
      visibility: "private",
    },
    party_mode: {
      themeColor: "#ffd700",
      mood: "energetic",
      visibility: "public",
    },
  };

  return presets[name] || presets.chill_vibes;
}

/**
 * Get profile layout options
 */
export function getProfileLayoutOptions() {
  return [
    {
      id: "compact",
      name: "Compact",
      description: "Clean and minimal profile view",
      preview: "Minimal layout with essential info",
    },
    {
      id: "full",
      name: "Full",
      description: "Complete profile with all details",
      preview: "Comprehensive profile showcase",
    },
    {
      id: "showcase",
      name: "Showcase",
      description: "Gallery-style profile for creators",
      preview: "Creative portfolio layout",
    },
  ];
}

/**
 * Get lounge mood options
 */
export function getLoungeMoodOptions() {
  return [
    { id: "chill", name: "Chill", emoji: "😎", color: "#00eaff" },
    { id: "creative", name: "Creative", emoji: "🎨", color: "#ff00cc" },
    { id: "focus", name: "Focus", emoji: "🎯", color: "#b000ff" },
    { id: "energetic", name: "Energetic", emoji: "⚡", color: "#ffd700" },
    { id: "cozy", name: "Cozy", emoji: "🏠", color: "#ff6b9d" },
  ];
}

/**
 * Validate profile customization
 */
export function validateProfileCustomization(
  customization: Partial<ProfileCustomization>
): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];

  if (customization.profileLayout) {
    const validLayouts = ["compact", "full", "showcase"];
    if (!validLayouts.includes(customization.profileLayout)) {
      errors.push("Invalid profile layout");
    }
  }

  if (customization.socialLinks) {
    const validPlatforms = ["twitter", "instagram", "linkedin", "github", "tiktok"];
    for (const platform of Object.keys(customization.socialLinks)) {
      if (!validPlatforms.includes(platform)) {
        errors.push(`Invalid social platform: ${platform}`);
      }
    }
  }

  if (customization.bio && customization.bio.length > 500) {
    errors.push("Bio exceeds 500 character limit");
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Validate lounge customization
 */
export function validateLoungeCustomization(
  customization: Partial<LoungeCustomization>
): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];

  if (customization.themeColor) {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(customization.themeColor)) {
      errors.push("Invalid theme color format");
    }
  }

  if (customization.mood) {
    const validMoods = ["chill", "creative", "focus", "energetic", "cozy"];
    if (!validMoods.includes(customization.mood)) {
      errors.push("Invalid lounge mood");
    }
  }

  if (customization.description && customization.description.length > 1000) {
    errors.push("Description exceeds 1000 character limit");
  }

  if (customization.welcomeMessage && customization.welcomeMessage.length > 500) {
    errors.push("Welcome message exceeds 500 character limit");
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}
