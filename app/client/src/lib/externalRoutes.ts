import { DEFAULT_LINK_CONFIG } from "./linkConfig";

/**
 * Backward-compatible defaults for non-configurable consumers.
 * Interactive UI should read linkConfig from OwnerViewContext instead.
 */
export const EXTERNAL_ROUTES = DEFAULT_LINK_CONFIG;
export type ExternalRoute = (typeof EXTERNAL_ROUTES)[keyof typeof EXTERNAL_ROUTES];
