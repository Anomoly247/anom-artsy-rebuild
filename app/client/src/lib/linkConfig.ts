import {
  DEFAULT_SITE_LINK_CONFIG,
  type CustomBanner,
  type PartnerSite,
  type SiteLinkConfig,
  type SocialLinks,
} from "@shared/siteConfig";

export type LinkConfig = SiteLinkConfig;
export type { CustomBanner, PartnerSite, SocialLinks };

export const DEFAULT_LINK_CONFIG: LinkConfig = DEFAULT_SITE_LINK_CONFIG;
export const LINK_CONFIG_STORAGE_KEY = "ao-link-config-v1";

function isValidHttpUrl(value: unknown, allowEmpty = false): value is string {
  if (allowEmpty && value === "") return true;
  if (typeof value !== "string" || value.trim().length === 0) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function stringOrDefault(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

export function normalizeLinkConfig(value: unknown): LinkConfig {
  if (!value || typeof value !== "object") return DEFAULT_LINK_CONFIG;

  const candidate = value as Partial<LinkConfig>;
  const social: Partial<SocialLinks> = candidate.social && typeof candidate.social === "object" ? candidate.social : {};
  const banner: Partial<CustomBanner> = candidate.banner && typeof candidate.banner === "object" ? candidate.banner : {};
  const partners = Array.isArray(candidate.partners) ? candidate.partners : [];

  const normalizedBanner: CustomBanner = {
    enabled: banner.enabled === true,
    eyebrow: stringOrDefault(banner.eyebrow, DEFAULT_LINK_CONFIG.banner.eyebrow),
    title: stringOrDefault(banner.title, DEFAULT_LINK_CONFIG.banner.title),
    message: stringOrDefault(banner.message, DEFAULT_LINK_CONFIG.banner.message),
    ctaLabel: stringOrDefault(banner.ctaLabel, DEFAULT_LINK_CONFIG.banner.ctaLabel),
    ctaUrl: isValidHttpUrl(banner.ctaUrl) ? banner.ctaUrl : DEFAULT_LINK_CONFIG.banner.ctaUrl,
  };

  const normalizedSocial: SocialLinks = {
    youtube: isValidHttpUrl(social.youtube, true) ? social.youtube : DEFAULT_LINK_CONFIG.social.youtube,
    instagram: isValidHttpUrl(social.instagram, true) ? social.instagram : DEFAULT_LINK_CONFIG.social.instagram,
    github: isValidHttpUrl(social.github, true) ? social.github : DEFAULT_LINK_CONFIG.social.github,
    tiktok: isValidHttpUrl(social.tiktok, true) ? social.tiktok : DEFAULT_LINK_CONFIG.social.tiktok,
    x: isValidHttpUrl(social.x, true) ? social.x : DEFAULT_LINK_CONFIG.social.x,
  };

  const normalizedPartners: PartnerSite[] = partners
    .filter((partner): partner is PartnerSite => Boolean(partner && typeof partner === "object"))
    .map((partner) => ({
      label: typeof partner.label === "string" ? partner.label.trim() : "",
      url: partner.url,
    }))
    .filter((partner) => partner.label.length > 0 && isValidHttpUrl(partner.url))
    .slice(0, 8);

  return {
    universe: isValidHttpUrl(candidate.universe) ? candidate.universe : DEFAULT_LINK_CONFIG.universe,
    store: isValidHttpUrl(candidate.store) ? candidate.store : DEFAULT_LINK_CONFIG.store,
    social: normalizedSocial,
    banner: normalizedBanner,
    partners: normalizedPartners,
  };
}

export function readLinkConfig(): LinkConfig {
  if (typeof window === "undefined") return DEFAULT_LINK_CONFIG;

  try {
    const saved = window.localStorage.getItem(LINK_CONFIG_STORAGE_KEY);
    return saved ? normalizeLinkConfig(JSON.parse(saved)) : DEFAULT_LINK_CONFIG;
  } catch {
    return DEFAULT_LINK_CONFIG;
  }
}

export function persistLinkConfig(config: LinkConfig): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LINK_CONFIG_STORAGE_KEY, JSON.stringify(normalizeLinkConfig(config)));
}
