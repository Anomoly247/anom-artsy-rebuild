# Sanctuary Recovery Findings — 2026-08-21

## Confirmed source archive

The repository’s current `/sanctuary` route is still an `ExternalRedirect`; the current and historical `app/client/public/pages/sanctuary.html` files are static Meta AI conversation captures and are not the authored React world page. They also reference a missing `sanctuary_files` directory, so they should not be wired into production as-is.

A preserved Drive archive was found and downloaded read-only:

- File: `anom-social-sanctuary-complete.zip`
- Drive ID: `1Aqp010ijuExnFpIlagg7tMGLMoHOY6Ut`
- Link: https://drive.google.com/file/d/1Aqp010ijuExnFpIlagg7tMGLMoHOY6Ut/view?usp=drivesdk
- Local inspection copy: `/home/ubuntu/anom-artsy-rebuild/recovery-inventory/anom-social-sanctuary-complete.zip`

The archive contains a complete older React/Express Sanctuary project under `anom-social-sanctuary-hosting/`, including `client/src/pages/Home.tsx`, `Cosmology.tsx`, `Gallery.tsx`, `Stories.tsx`, `Shop.tsx`, and the shared `Navigation.tsx`. Its recovered Home page is an earlier neon Sanctuary landing/dashboard implementation with identity, Social Good, Anom Coin, lounge, games, Kids Corner, profile customization, and membership sections. `Cosmology.tsx` is a lore page describing the Sanctuary world, not the current Universe Map.

## Recovery boundary

Do not overwrite the locked current `/` homepage or `/dashboard` Universe Map. The next restoration step should compare the archived source against the current AO design tokens and identify the exact authored “pretty world” component before changing `/sanctuary`.

All recovered source remains Anom-authored project material and must preserve provenance. The archive was inspected but no archived code has been copied into the live repository yet.
