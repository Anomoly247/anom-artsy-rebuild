export type SocialLinks = {
  youtube: string;
  instagram: string;
  github: string;
  tiktok: string;
  x: string;
};

export type CustomBanner = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  message: string;
  ctaLabel: string;
  ctaUrl: string;
};

export type PartnerSite = {
  label: string;
  url: string;
};

export type SiteLinkConfig = {
  universe: string;
  store: string;
  social: SocialLinks;
  banner: CustomBanner;
  partners: PartnerSite[];
};

export const DEFAULT_SITE_LINK_CONFIG: SiteLinkConfig = {
  universe: "https://universe.anomartsy.xyz/",
  store: "https://anomoriginals.myspreadshop.com/",
  social: {
    youtube: "https://www.youtube.com/@anomoriginals",
    instagram: "https://www.instagram.com/anomoriginals/",
    github: "https://github.com/Anomoly247",
    tiktok: "",
    x: "",
  },
  banner: {
    enabled: false,
    eyebrow: "AO TRANSMISSION",
    title: "A living universe for identity.",
    message: "Enter the connected world of Anom Artsy.",
    ctaLabel: "Enter the Universe",
    ctaUrl: "https://universe.anomartsy.xyz/",
  },
  partners: [],
};
