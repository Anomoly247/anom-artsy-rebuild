import { describe, expect, it } from "vitest";
import {
  getVideoSource,
  PIXEL_DOT_FALLBACK_VIDEO_ID,
  PIXEL_DOT_FALLBACK_VIDEO_URL,
} from "../shared/videoSources";

describe("Pixel and Dot video fallback", () => {
  it("selects the public fallback when the hosted MP4 fails", () => {
    const hostedSource = "/manus-storage/v8_pixel_dot_full_story_final_45228357.mp4";

    expect(PIXEL_DOT_FALLBACK_VIDEO_ID).toBe("0pBrQUqU0ig");
    expect(getVideoSource(hostedSource, PIXEL_DOT_FALLBACK_VIDEO_URL, false)).toBe(hostedSource);
    expect(getVideoSource(hostedSource, PIXEL_DOT_FALLBACK_VIDEO_URL, true)).toBe(PIXEL_DOT_FALLBACK_VIDEO_URL);
  });

  it("keeps a primary source when no fallback is configured", () => {
    expect(getVideoSource("/videos/example.mp4", undefined, true)).toBe("/videos/example.mp4");
  });
});
