/**
 * Membership Tier System
 * Defines tier benefits, pricing, and features
 */

export type MembershipTier = "basic" | "vip" | "super_vip";

export interface TierDefinition {
  id: MembershipTier;
  name: string;
  displayName: string;
  description: string;
  monthlyPrice: number;
  benefits: string[];
  coinMultiplier: number;
  maxLounges: number;
  badgeColor: string;
  icon: string;
  features: TierFeatures;
}

export interface TierFeatures {
  unlimitedLounges: boolean;
  premiumDecorations: boolean;
  customThemes: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  exclusiveEvents: boolean;
  customAnimations: boolean;
  featuredCreatorStatus: boolean;
  musicPlaylistCustomization: boolean;
  profileAnimations: boolean;
}

export interface MembershipStatus {
  tier: MembershipTier;
  upgradeDate?: Date;
  expiresAt?: Date;
  isActive: boolean;
  daysRemaining?: number;
  coinMultiplier: number;
}

/**
 * Tier Definitions
 */
export const TIER_DEFINITIONS: Record<MembershipTier, TierDefinition> = {
  basic: {
    id: "basic",
    name: "Basic",
    displayName: "Basic Member",
    description: "Free membership with standard features",
    monthlyPrice: 0,
    benefits: [
      "Standard profile customization",
      "Access to public lounges",
      "Basic decoration packages",
      "Standard coin earning rates",
      "1 lounge creation",
      "Basic music library access",
    ],
    coinMultiplier: 1.0,
    maxLounges: 1,
    badgeColor: "#7a7f8e",
    icon: "User",
    features: {
      unlimitedLounges: false,
      premiumDecorations: false,
      customThemes: false,
      advancedAnalytics: false,
      prioritySupport: false,
      exclusiveEvents: false,
      customAnimations: false,
      featuredCreatorStatus: false,
      musicPlaylistCustomization: false,
      profileAnimations: false,
    },
  },
  vip: {
    id: "vip",
    name: "VIP",
    displayName: "VIP Member",
    description: "Premium membership with exclusive features",
    monthlyPrice: 9.99,
    benefits: [
      "Unlimited lounge creation",
      "Premium decoration packages",
      "2x coin earning multiplier",
      "Custom profile themes",
      "VIP badge on profile",
      "Priority in social feed algorithm",
      "Advanced music library features",
      "Custom lounge backgrounds",
      "VIP-only lounges access",
    ],
    coinMultiplier: 2.0,
    maxLounges: 999,
    badgeColor: "#00eaff",
    icon: "Crown",
    features: {
      unlimitedLounges: true,
      premiumDecorations: true,
      customThemes: true,
      advancedAnalytics: false,
      prioritySupport: true,
      exclusiveEvents: true,
      customAnimations: false,
      featuredCreatorStatus: false,
      musicPlaylistCustomization: true,
      profileAnimations: false,
    },
  },
  super_vip: {
    id: "super_vip",
    name: "Super VIP",
    displayName: "Super VIP Member",
    description: "Ultimate membership with all premium features",
    monthlyPrice: 24.99,
    benefits: [
      "All VIP benefits",
      "3x coin earning multiplier",
      "Exclusive Super VIP decorations",
      "Custom profile animations",
      "Super VIP badge with special effects",
      "Featured creator status",
      "Advanced analytics dashboard",
      "Custom music playlists",
      "Priority support",
      "Exclusive events access",
      "Early access to new features",
      "Custom profile page design",
    ],
    coinMultiplier: 3.0,
    maxLounges: 999,
    badgeColor: "#ffd700",
    icon: "Sparkles",
    features: {
      unlimitedLounges: true,
      premiumDecorations: true,
      customThemes: true,
      advancedAnalytics: true,
      prioritySupport: true,
      exclusiveEvents: true,
      customAnimations: true,
      featuredCreatorStatus: true,
      musicPlaylistCustomization: true,
      profileAnimations: true,
    },
  },
};

/**
 * Get tier definition
 */
export function getTierDefinition(tier: MembershipTier): TierDefinition {
  return TIER_DEFINITIONS[tier] || TIER_DEFINITIONS.basic;
}

/**
 * Get all tier definitions
 */
export function getAllTiers(): TierDefinition[] {
  return Object.values(TIER_DEFINITIONS);
}

/**
 * Get tier benefits
 */
export function getTierBenefits(tier: MembershipTier): string[] {
  return getTierDefinition(tier).benefits;
}

/**
 * Get tier features
 */
export function getTierFeatures(tier: MembershipTier): TierFeatures {
  return getTierDefinition(tier).features;
}

/**
 * Check if tier has feature
 */
export function hasTierFeature(tier: MembershipTier, feature: keyof TierFeatures): boolean {
  const features = getTierFeatures(tier);
  return features[feature] === true;
}

/**
 * Get coin multiplier for tier
 */
export function getCoinMultiplier(tier: MembershipTier): number {
  return getTierDefinition(tier).coinMultiplier;
}

/**
 * Get max lounges for tier
 */
export function getMaxLounges(tier: MembershipTier): number {
  return getTierDefinition(tier).maxLounges;
}

/**
 * Get tier badge color
 */
export function getTierBadgeColor(tier: MembershipTier): string {
  return getTierDefinition(tier).badgeColor;
}

/**
 * Calculate days remaining in tier
 */
export function calculateDaysRemaining(expiresAt: Date): number {
  const now = new Date();
  const daysRemaining = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysRemaining);
}

/**
 * Check if tier is active
 */
export function isTierActive(expiresAt?: Date): boolean {
  if (!expiresAt) return true; // Permanent tier (basic)
  return new Date() < expiresAt;
}

/**
 * Get tier upgrade price
 */
export function getTierUpgradePrice(fromTier: MembershipTier, toTier: MembershipTier): number {
  const fromPrice = getTierDefinition(fromTier).monthlyPrice;
  const toPrice = getTierDefinition(toTier).monthlyPrice;
  return Math.max(0, toPrice - fromPrice);
}

/**
 * Get tier comparison data for UI
 */
export function getTierComparison() {
  const tiers = getAllTiers();
  const allFeatures = new Set<keyof TierFeatures>();

  // Collect all features
  tiers.forEach((tier) => {
    Object.keys(tier.features).forEach((feature) => {
      allFeatures.add(feature as keyof TierFeatures);
    });
  });

  return {
    tiers,
    features: Array.from(allFeatures),
  };
}

/**
 * Format tier name for display
 */
export function formatTierName(tier: MembershipTier): string {
  return getTierDefinition(tier).displayName;
}

/**
 * Get tier icon
 */
export function getTierIcon(tier: MembershipTier): string {
  return getTierDefinition(tier).icon;
}

/**
 * Validate tier
 */
export function isValidTier(tier: string): tier is MembershipTier {
  return tier === "basic" || tier === "vip" || tier === "super_vip";
}
