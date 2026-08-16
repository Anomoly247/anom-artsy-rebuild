# IndexedDB Background Verification

The custom background repository is covered by `server/backgroundImageStore.test.ts`, which saves a PNG Blob into an IndexedDB factory, loads it back with its MIME type and bytes intact, clears it, and verifies safe behavior when IndexedDB is unavailable. The existing `server/backgroundStorage.test.ts` covers compact preset persistence, oversized-value rejection, stale-data cleanup, and quota recovery.

The Home and `/owner?tab=settings` routes were rendered successfully after integration. Home hydrates the saved Blob into a session object URL on mount, revokes object URLs on replacement and unmount, and clears the IndexedDB image when a preset is selected.

The available screenshot capture mechanism can load routes but cannot select a local file, trigger the upload input, or reload a browser session while preserving the same IndexedDB profile. Therefore, end-to-end file-selection and cross-reload evidence is represented by the repository tests and implementation-level lifecycle checks rather than an interactive screenshot.
