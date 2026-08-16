# Custom Background Gallery Verification

The custom-background gallery is implemented in `client/src/components/CustomBackgroundGallery.tsx` and mounted from Home. It provides preview cards, active selection, deletion, an upload action, and opacity and blur sliders. Home hydrates gallery records from IndexedDB, creates object URLs for previews, fades the active image into view after it loads, and revokes URLs on replacement and unmount.

The repository and appearance persistence paths are covered by `server/backgroundImageStore.test.ts` and `server/backgroundStorage.test.ts`. The full validation run completed with 18 test files and 51 passing tests, clean TypeScript checks, and a successful production build. Home and `/owner?tab=settings` also render successfully at desktop and mobile viewports.

The available screenshot capture can navigate to routes but cannot select a local file, open the gallery through a click, manipulate Radix sliders, or reload a browser profile while preserving an uploaded IndexedDB record. Consequently, end-to-end interaction evidence for upload, gallery select/delete, and slider drag is not available from this session; the repository tests, component contracts, and rendered route checks provide the verified coverage currently possible.
