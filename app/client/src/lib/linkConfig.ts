export type LinkConfig = {
  universe: string;
  store: string;
};

export const DEFAULT_LINK_CONFIG: LinkConfig = {
  universe: "https://universe.anomartsy.xyz/",
  store: "https://anomoriginals.myspreadshop.com/",
};

export const LINK_CONFIG_STORAGE_KEY = "ao-link-config-v1";

function isValidHttpUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.trim().length === 0) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeLinkConfig(value: unknown): LinkConfig {
  if (!value || typeof value !== "object") return DEFAULT_LINK_CONFIG;

  const candidate = value as Partial<LinkConfig>;
  return {
    universe: isValidHttpUrl(candidate.universe) ? candidate.universe : DEFAULT_LINK_CONFIG.universe,
    store: isValidHttpUrl(candidate.store) ? candidate.store : DEFAULT_LINK_CONFIG.store,
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
