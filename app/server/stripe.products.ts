/**
 * Stripe Products and Pricing Configuration
 * Centralized product definitions for membership tiers and tipping
 */

export const STRIPE_PRODUCTS = {
  // Membership Tier Products
  MEMBERSHIP_VIP: {
    name: "Anom Artsy VIP",
    description: "VIP membership with exclusive features and benefits",
    priceUSD: 10.00,
    interval: "month" as const,
    features: [
      "Exclusive VIP badge on profile",
      "Priority support",
      "2x Anom Coin rewards",
      "Custom lounge themes",
      "VIP-only content access"
    ]
  },
  
  MEMBERSHIP_SUPER_VIP: {
    name: "Anom Artsy Super VIP",
    description: "Super VIP membership with premium features and priority access",
    priceUSD: 25.00,
    interval: "month" as const,
    features: [
      "Super VIP badge on profile",
      "24/7 priority support",
      "3x Anom Coin rewards",
      "Unlimited custom lounge themes",
      "Early access to new features",
      "Monthly exclusive content drops",
      "Creator partnership opportunities"
    ]
  },

  // One-Time Tipping Products
  TIP_SMALL: {
    name: "Support with a Tip",
    description: "Send a small tip to support creators",
    priceUSD: 5.00,
    interval: null,
    emoji: "💜"
  },

  TIP_MEDIUM: {
    name: "Support with a Big Tip",
    description: "Send a generous tip to support creators",
    priceUSD: 10.00,
    interval: null,
    emoji: "💙"
  },

  TIP_LARGE: {
    name: "Support with a Huge Tip",
    description: "Send a massive tip to support creators",
    priceUSD: 25.00,
    interval: null,
    emoji: "💚"
  },

  TIP_CUSTOM: {
    name: "Custom Tip Amount",
    description: "Support creators with a custom tip amount",
    priceUSD: null, // Custom amount
    interval: null,
    emoji: "🌟"
  }
};

export type StripeProductKey = keyof typeof STRIPE_PRODUCTS;

/**
 * Get product by key
 */
export function getProduct(key: StripeProductKey) {
  return STRIPE_PRODUCTS[key];
}

/**
 * Get all membership products
 */
export function getMembershipProducts() {
  return {
    vip: STRIPE_PRODUCTS.MEMBERSHIP_VIP,
    superVip: STRIPE_PRODUCTS.MEMBERSHIP_SUPER_VIP,
  };
}

/**
 * Get all tipping products
 */
export function getTippingProducts() {
  return {
    small: STRIPE_PRODUCTS.TIP_SMALL,
    medium: STRIPE_PRODUCTS.TIP_MEDIUM,
    large: STRIPE_PRODUCTS.TIP_LARGE,
    custom: STRIPE_PRODUCTS.TIP_CUSTOM,
  };
}

/**
 * Format price for display
 */
export function formatPrice(priceUSD: number | null): string {
  if (priceUSD === null) return "Custom";
  return `$${priceUSD.toFixed(2)}`;
}

/**
 * Get price in cents for Stripe API
 */
export function getPriceInCents(priceUSD: number): number {
  return Math.round(priceUSD * 100);
}
