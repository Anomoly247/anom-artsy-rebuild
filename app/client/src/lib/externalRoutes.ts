export const EXTERNAL_ROUTES = {
  universe: "https://universe.anomartsy.xyz/",
  shop: "https://anomoriginals.myspreadshop.com/",
} as const;

export type ExternalRoute = (typeof EXTERNAL_ROUTES)[keyof typeof EXTERNAL_ROUTES];
