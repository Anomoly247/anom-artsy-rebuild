# Pixel and Dot Video Playback Verification

The shared hosted source `/manus-storage/v8_pixel_dot_full_story_final_45228357.mp4` was checked through the preview storage proxy. The proxy returns a signed CloudFront redirect, and the upstream object responds with HTTP 403. This is an asset-permission failure, not a React route failure.

Both `/anoms-corner` and `/kids-corner` now use the same public fallback source, `https://www.youtube.com/embed/0pBrQUqU0ig`, after the hosted MP4 emits a media error. The `/anoms-corner` default episode was captured in the preview with the fallback iframe visible and the notice that the hosted copy is unavailable.

The shared fallback selector is covered by the collected `server/videoSources.test.ts` regression test. The available screenshot verification tool can load both routes but cannot click the Kids Corner Watch control, so the Kids Corner error transition is verified by the shared player implementation and the collected unit test rather than an interactive modal screenshot.
