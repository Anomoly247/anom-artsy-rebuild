export type AOCityNode = {
  id: string;
  title: string;
  guide: string;
  pillar: "Community" | "Creativity" | "Education";
  route: string;
  description: string;
  readiness: "live" | "content-awaiting" | "review-gated";
  signal: string;
};

export type SanctuaryIdentityPrinciple = {
  id: string;
  title: string;
  description: string;
  accent: "cyan" | "magenta" | "gold";
};

/**
 * Authored AO-City/Sanctuary content packet.
 *
 * Source provenance: AO Universe master specification, Universe Map Route and
 * Content Inventory, Sanctuary Safety Layer work order, and the recovered
 * Sanctuary React archive. These records are descriptive content only; media
 * publication and user-facing awards remain Guardian-reviewable server data.
 */
export const aoCityNodes: AOCityNode[] = [
  {
    id: "heartfield-commons",
    title: "Heartfield Commons",
    guide: "Clifford",
    pillar: "Community",
    route: "/dashboard",
    description: "A welcoming commons for constructive participation, shared missions, and gentle community rhythm.",
    readiness: "live",
    signal: "Community pulse",
  },
  {
    id: "snack-quarter",
    title: "The Snack Quarter",
    guide: "Tater Nugget",
    pillar: "Creativity",
    route: "/games",
    description: "Playful discovery, mini-games, and earned Anom Coin loops with room for curiosity instead of pressure.",
    readiness: "live",
    signal: "Play loop",
  },
  {
    id: "financial-district",
    title: "The Financial District",
    guide: "Security Bot X-9",
    pillar: "Education",
    route: "/financial-district",
    description: "A learning district for saving, spending, financial literacy, and good-action progress.",
    readiness: "content-awaiting",
    signal: "Lesson gate",
  },
  {
    id: "neon-gallery",
    title: "The Neon Gallery",
    guide: "AO Curators",
    pillar: "Creativity",
    route: "/neon-gallery",
    description: "A curated lane for approved art, identity fragments, creator signals, and neon environments.",
    readiness: "review-gated",
    signal: "Guardian review",
  },
  {
    id: "broadcast-tower",
    title: "The Broadcast Tower",
    guide: "Pixel & Dot",
    pillar: "Education",
    route: "/broadcast",
    description: "Cross-world releases, story signals, character notes, and carefully reviewed announcements.",
    readiness: "live",
    signal: "Signal incoming",
  },
  {
    id: "the-core",
    title: "The Core",
    guide: "The AO Symbol",
    pillar: "Community",
    route: "/dashboard",
    description: "The heart of AO-City where missions, Anom Coin, Social Good Score, and shared identity meet.",
    readiness: "live",
    signal: "System center",
  },
];

export const sanctuaryIdentityPrinciples: SanctuaryIdentityPrinciple[] = [
  {
    id: "identity",
    title: "Identity, Amplified",
    description: "Profiles grow through deliberate choices, earned recognition, and approved digital expression—not user code.",
    accent: "cyan",
  },
  {
    id: "social-good",
    title: "Social Good First",
    description: "Verified actions contribute to a Social Good Score that remains distinct from spendable Anom Coin.",
    accent: "magenta",
  },
  {
    id: "guardian",
    title: "Guardian Reviewed",
    description: "Authored media, awards, missions, and Store submissions retain attribution, provenance, and review state.",
    accent: "gold",
  },
];

export const sanctuaryContentProvenance = {
  sourceRegister: [
    "ao_universe_master_specification",
    "AO_Universe_Reconciliation_and_Build_Plan.md",
    "Universe Map Route and Content Inventory",
    "Sanctuary_Safety_Layer_Work_Order.md",
    "Sanctuary_ToS_Privacy_Draft.md",
    "anom-social-sanctuary-complete.zip",
  ],
  publicationPolicy: "descriptive records are safe to stage; media, awards, missions, and Store submissions remain Guardian-reviewable before publication",
} as const;
