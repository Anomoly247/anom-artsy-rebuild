export type AoMediaType = "image" | "video";
export type AoPrivacyState = "approved" | "pending" | "restricted";
export type GuardianReviewStatus = "pending" | "approved" | "rejected";

export interface AoMediaManifestRecord {
  recordId: string;
  sourceId: string;
  worldPath: string;
  route: string;
  filename: string;
  mediaType: AoMediaType;
  sourceUrl: string;
  localPath: string;
  privacyState: AoPrivacyState;
  authorship: string;
  guardianStatus: GuardianReviewStatus;
  reviewer: string | null;
  reviewedAt: string | null;
  altTextOrCaption: string;
  checksum: string;
}

/**
 * First localized Anom’s Corner asset. It remains Guardian-pending until the
 * owner records the review decision in the protected admin workflow.
 */
export const aoMediaManifest: AoMediaManifestRecord[] = [
  {
    recordId: "ao-anoms-corner-moonberry-1920x1080",
    sourceId: "moonberry-farm-loading-pack/moonberry-1920x1080.webp",
    worldPath: "worlds/pixel-dot/spaces/anoms-corner/",
    route: "/moonberry-farm",
    filename: "moonberry-1920x1080.webp",
    mediaType: "image",
    sourceUrl: "file:///home/ubuntu/anom-artsy-rebuild/moonberry-farm-loading-pack/extracted/assets/moonberry-1920x1080.webp",
    localPath: "/media/anoms-corner/moonberry-1920x1080.webp",
    privacyState: "approved",
    authorship: "Anom Originals",
    guardianStatus: "pending",
    reviewer: null,
    reviewedAt: null,
    altTextOrCaption:
      "Moonberry Farm at night with a cozy farmhouse, glowing berry fields, a winding path, distant mountains, and a large moon beneath a cyan and pink sky.",
    checksum: "sha256:8fe4db7f839bf0418de5af3cf174be6eed7d098407072ebb57ed742abe42b606",
  },
];
