export const PIXEL_DOT_FALLBACK_VIDEO_ID = "0pBrQUqU0ig";
export const PIXEL_DOT_FALLBACK_VIDEO_URL = `https://www.youtube.com/embed/${PIXEL_DOT_FALLBACK_VIDEO_ID}`;

export function getVideoSource(primaryUrl: string, fallbackUrl: string | undefined, primaryFailed: boolean) {
  return primaryFailed && fallbackUrl ? fallbackUrl : primaryUrl;
}
