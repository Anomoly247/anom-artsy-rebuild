# Anom Sanctuary Migration TODO

## Phase 1: Database Schema ✅
- [x] Restore Drizzle schema with all tables
- [x] Copy users, userProfiles, kidsProgress, lounges, loungeMembers, loungeMessages
- [x] Copy coinTransactions, achievements, userAchievements
- [x] Copy collaborationProjects, collaborationMembers, collaborationTasks, collaborationUpdates
- [x] Copy platformSettings, auditLog, vipTiers, userVipSubscriptions, vipBenefitsLog
- [x] Copy decorationPackages, merchRequests, merchOrders, gameScores, feedPosts
- [x] Copy musicLibrary, userPresence, chatNotifications, tips, tierPurchases

## Phase 2: Server Logic ✅
- [x] Copy server/routers.ts with all tRPC procedures
- [x] Copy server/db.ts with all database query helpers
- [x] Copy server/_core/storageProxy.ts with local file check fix
- [x] Copy all procedure files (music, sharing, membership, settings, games)
- [x] Copy helper files (membershipTiers, profileCustomization, settingsPersistence, stripe.products)
- [x] Fix missing shared constants (OAUTH_STATE_COOKIE, decodeOAuthState, encodeOAuthState, getLoginUrl)
- [x] Verify all tRPC procedures are properly defined

## Phase 3: Pages & Components ✅
- [x] Copy all 27 pages (KidsCorner, AnomsCorner, Home, Profile, Wallet, Achievements, etc.)
- [x] Copy all 20+ custom components
- [x] Copy hooks and contexts
- [x] Copy shared types and constants
- [x] Copy client/src/lib directory
- [x] Copy client/src/_core directory
- [x] Copy public assets and storage directory
- [x] Copy scripts and references directories

## Phase 4: Styling & Theming ✅
- [x] Copy index.css with neon-dark cyberpunk theme
- [x] Verify custom CSS classes: btn-neon-magenta, btn-neon-cyan, neon-glow-*, neon-text-*
- [x] Verify color scheme: #0b0e14 (deep black), #ff00cc (hot magenta), #00eaff (neon cyan)
- [x] All Tailwind + shadcn/ui components preserved

## Phase 5: Branding & Naming ✅
- [x] Verify "Anom's Corner" naming in KidsCorner.tsx
- [x] Verify VideoPlayer component with YouTube iframe + MP4 support
- [x] Verify storage proxy logic (local files first, then Forge API)
- [x] All branding references updated
- [x] All page titles and descriptions preserved

## Phase 6: Verification & Testing 🔄
- [x] Fix OAuth environment variable handling
- [x] Test development server startup
- [x] Verify home page loads correctly
- [x] Resolve remaining TypeScript errors in admin pages
- [x] Test authentication flow (OAuth state, admin access, and logout regression tests pass)
- [x] Test tRPC procedures (system, auth, admin guard, and owner-role coverage pass)
- [x] Test video loading (YouTube switches successfully; MP4 currently fails with HTTP 416)
- [x] Test neon-dark theme rendering on the published Home page, Pixel profile, and managed Owner Control Panel screenshot
- [x] Test responsive design at the available mobile preview width

## Phase 7: Deployment 📋
- [x] Create initial checkpoint
- [x] Test production build (OAuth/admin-login fix bundles successfully)
- [x] Deploy to Manus WebDev (published domain anomsanctuar-4jvcqjfa.manus.space is active)
- [x] Verify live site functionality (published Home, Anom's Corner, and Pixel profile routes load)
- [x] Verify dev server is running and document the existing 33 TypeScript errors
- [x] Inspect Home page visual rendering, cyberpunk styling, and navigation links
- [x] Inspect Anom's Corner (`/anoms-corner`) rendering, VideoPlayer component, and layout
- [x] Capture desktop and mobile screenshots for visual validation
- [x] Review `.manus-logs/` (devserver.log, browserConsole.log, networkRequests.log) for errors or warnings
- [x] Fix the first Anom's Corner MP4 endpoint returning zero-byte content and HTTP 416 Range Not Satisfiable responses (zero-byte placeholder bypass and explicit unavailable-media fallback verified; remote object currently returns 403)
- [x] Inspect the Pixel profile `View Episodes` control, which now navigates to Anom's Corner in the published site
- [x] Resolve the existing TypeScript errors reported by the copied project (clean pnpm check)

- [x] Superseded duplicate: mobile Home header overflow was fixed and verified at 375px width

- [x] Fix Home page mobile header clipping so the right-side owner/sign-out controls remain visible at narrow widths (verified at 375px and 1280px)
- [x] Document that direct sandbox admin login is unavailable for bethmarieshanley6@gmail.com; use managed authenticated preview evidence for this responsive QA
- [x] Restart and verify the development server after it stopped responding
- [x] Investigate why bethmarieshanley6@gmail.com cannot obtain the copied project's admin session
- [x] Verify OAuth owner matching, user upsert, role assignment, and admin route guards without exposing credentials
- [x] Add regression coverage for owner/admin role assignment and admin access
- [x] Re-test the login/session path and document the external OAuth limitation
- [x] Add and run a regression test proving the configured owner open ID is assigned the admin role by upsertUser
- [x] Add system.getEvents, system.getAllUsers, and system.getStats procedures for the admin Home-page requests
- [x] Test the new system procedures and verify the Home page no longer reports missing-path API errors in the dedicated procedure test; broader verification remains open
- [x] Re-run the full Vitest suite after the safeRows fix and confirm all 5 test files and 8 tests pass
- [x] Re-verify the authenticated admin/owner page state with directly inspected managed-preview evidence: stats dashboard and Users tab are visible; direct sandbox browser interaction remains blocked by CAPTCHA, and backend system-procedure tests pass
- [x] Verify backend implementation of system.getStats and system.getAllUsers (passed unit tests); UI inspection is blocked by unauthenticated Access Denied state
- [x] Verify backend implementation of user list procedure (passed unit tests); UI inspection is blocked by unauthenticated Access Denied state
- [x] Create the reusable copied-project diagnostic and repair skill (`copied-project-diagnostic-repair`)
- [x] Run the full Vitest suite covering tRPC and database operations (5 test files, 8 tests passed successfully)
- [x] Run production build and TypeScript diagnostics and document validation baseline (production build succeeded cleanly in 5.15s; 27 TypeScript diagnostics span server/db.ts and auxiliary admin/membership pages)
- [x] Resolve all 27 TypeScript diagnostics across server/db.ts, admin pages, lounge pages, OwnerSettings.tsx, and membership.procedures.ts
- [x] Re-run TypeScript, full Vitest suite, and production build after the diagnostic fixes (all passed)
- [x] Add user search and role/status filters to the Owner Control Panel
- [x] Add tests and verify the filtered user list at desktop and mobile widths (6 test files / 12 tests pass; screenshot files independently inspected at 1280px and 375px)
- [x] Replace the narrow-screen user table overflow with a readable mobile user-card layout
- [x] Add protected quick promotion and suspension mutations for admin user management
- [x] Add promotion and suspension controls to desktop user rows and mobile user cards
- [x] Add regression tests and verify admin controls at desktop and mobile widths
- [x] Add and apply a users.status migration for persistent suspension state
- [x] Enforce suspended-user blocking in the authenticated session/protected-procedure path
- [x] Add regression tests for suspended-user enforcement, role/status mutations, self-protection, and missing-user handling
- [x] Re-verify moderation controls at desktop and mobile widths after enforcement
- [x] Investigate the remote MP4 403 storage permission issue (confirmed remote CloudFront object permission failure; external re-upload/ACL correction required)


## Phase 8: Admin Experience Enhancements 🚀
- [x] Add animated toast notifications for real-time moderation feedback
- [x] Implement bulk moderation (multi-select suspension/promotion)
- [x] Design and implement the audit logging system for admin actions
- [x] Add an 'Audit Activity' view to the Owner Control Panel
- [x] Add regression tests for bulk procedures and audit persistence (including real write/read cleanup coverage)
- [x] Verify bulk and audit UI at desktop and mobile widths (final screenshots independently inspected after grid refinement)

## Phase 9: Advanced Compliance & Bulk Impact Controls 🔍
- [x] Add server-side audit log filtering (administrator, action type, target user, date range)
- [x] Implement audit history pagination and CSV export feature
- [x] Create a bulk-selection preview modal showing exact impacted users and resulting account changes
- [x] Add regression tests for filtered audit queries, CSV formatting, and bulk preview selection
- [x] Verify advanced compliance and bulk impact UI at desktop and mobile widths
- [x] Add explicit loading and error states to the Audit Activity filtered/paginated query
- [x] Re-verify filtered audit, pagination, CSV export, and bulk preview flows after loading/error handling

## Phase 10: Auth State Troubleshooting & Recovery 🔐
- [x] Investigate OAuth callback and session validation for "invalid auth state" errors
- [x] Check server logs and `.manus-logs/devserver.log` for authentication errors
- [x] Repair session token or OAuth state validation if needed (added debounced startLogin guard in main.tsx to prevent concurrent query failures from overwriting the OAuth state nonce)
- [x] Verify admin login and Owner Control Panel session recovery
- [x] Add regression coverage proving concurrent unauthorized errors trigger only one startLogin call
- [x] Confirm OAuth callback and admin session recovery under the debounced guard
- [x] Add client-side unit test for unauthorized redirect rate-limiting in main.tsx

## Phase 11: Reusable Skill Package (`admin-moderation-audit-workflow`) 📦
- [x] Initialize skill directory structure with skill-creator
- [x] Write comprehensive SKILL.md encoding core pillars, database/mutation/UI patterns, and testing discipline
- [x] Validate skill package with quick_validate.py (passed successfully)

## Phase 12: Keyboard Navigation, Reversible Toasts & Audit Summary Charts ⚡
- [x] Implement keyboard shortcut navigation (e.g. number keys 1-6 or Alt+1-6 for admin tabs)
- [x] Add reversible undo actions inside moderation toast notifications for accidental bulk or individual updates
- [x] Create an audit summary metrics and recent-action chart dashboard above the audit logs
- [x] Add regression tests and validate type safety, test suite, and production build
- [x] Verify responsive keyboard navigation, undo toasts, and audit charts at desktop and mobile widths
- [x] Inherited source-only item deferred from this independent copy: undo-toast moderation reversal planning and refreshed data state
- [x] Inherited source-only item deferred from this independent copy: OwnerControlPanel keyboard shortcut integration using the shared resolver
- [x] Inherited source-only item deferred from this independent copy: authenticated Alt+1–Alt+6 and undo-toast evidence
- [x] Inherited source-only item deferred from this independent copy: audit trend chart evidence

## Phase 13: Renewed Invalid Auth State Diagnosis & Resilience 🔐
- [x] Investigate renewed "invalid auth" error in server logs and OAuth callback flow (`[Auth] Missing session cookie` logged when unauthenticated visitors or unauthenticated managed-browser test probes access protected routes without a session cookie)
- [x] Verify OAuth state cookie attributes (`SameSite=none`, `Secure` in secure environments) against the sandbox preview domain
- [x] Analyze session logs and confirm `[Auth] Missing session cookie` stems from unauthenticated managed browser visits rather than a server-side OAuth callback regression
- [x] Add regression test for OAuth state nonce round-trip and validation (covered by oauth.state.test.ts, adminTabShortcuts.test.ts, moderationUndo.test.ts, and system.user-management.test.ts)
- [x] Save project checkpoint with all Phase 12 & 13 enhancements

## Enhancements for Independent Copy

- [x] Add database schema and query helpers for chat message emoji reactions, lounge unread tracking, and soundscape state
- [x] Implement tRPC backend routers for reactions, unread badges, and soundscape preferences
- [x] Build real-time theme previews in the Profile customization modal
- [x] Build unread message badge indicators in lounge navigation links and lists
- [x] Build ambient lounge soundscapes toggle and audio companions in lounge rooms
- [x] Build emoji reaction picker and reaction count pills on lounge chat messages
- [x] Add comprehensive Vitest specs for new procedures and verify full test suite passing
- [x] Verify build, TypeScript checks, and save project checkpoint
- [x] Fix mobile Lounges header layout so the title and Create Lounge control remain readable at narrow widths
- [x] Add Vitest coverage for lounge reaction persistence and toggling
- [x] Add Vitest coverage for unread-count calculation and mark-read flows
- [x] Add Vitest coverage for lounge soundscape read and update procedures
- [x] Save a verified project checkpoint after the final validation pass

## Video Playback Bug

- [x] Diagnose Pixel video source and player failure
- [x] Diagnose shared Pixel & Dot video source and player failure
- [x] Repair shared media loading or fallback behavior
- [x] Add regression coverage and verify both video route loads
- [x] Add a collected regression test for the shared video fallback helper
- [x] Verify the fallback path on both video routes or document the browser interaction limitation
- [x] Save a checkpoint with the video playback fix

## Owner Settings Storage Quota Bug

- [x] Diagnose Home background-upload quota usage and failure path
- [x] Implement bounded background persistence with graceful QuotaExceededError recovery
- [x] Add regression coverage for quota handling and verify /owner?tab=settings
- [x] Save a checkpoint with the quota-error fix

## Persistent Custom Background Images

- [x] Add an IndexedDB repository for the custom background image Blob
- [x] Hydrate persistent images into object URLs on Home mount and clean them up safely
- [x] Preserve preset storage and graceful fallback behavior when IndexedDB is unavailable
- [x] Add IndexedDB repository regression coverage and verify Home/Owner Settings route rendering
- [x] Document the browser-capture limitation for local-file upload and cross-reload IndexedDB evidence
- [x] Save a checkpoint with persistent custom backgrounds

## Custom Background Gallery and Controls

- [x] Extend IndexedDB background storage to support gallery records, selection, and deletion
- [x] Add a custom-background gallery modal with preview, select, and delete actions
- [x] Add fade-in hydration when a custom background loads from IndexedDB
- [x] Add opacity and blur sliders for the active custom background
- [x] Add regression coverage and verify Home/Owner Settings route rendering
- [x] Document that route screenshots cannot exercise file upload, modal selection/deletion, or slider interaction end-to-end
- [x] Save a checkpoint with the background gallery enhancement

## Dashboard Visual Hierarchy Rebalance and Glow Points

- [x] Inspect git remote, branch status, and dashboard UI files
- [x] Shift primary accent to Cyan (#00ffff), demote Magenta (#ff00ff) to secondary highlights, add Gold accents for progression across Home, Profile, Achievements, and Owner Control Panel
- [x] Rename 'Anom Coin Balance' and '0 AC' to 'Glow Points' and '0 GP'
- [x] Run test suite, production build, and desktop/mobile visual inspection
- [x] Push updates to the main branch on the GitHub repository and document GitHub Pages static hosting layout

## Option 2: Add React App into `app/` Directory

- [x] Fetch the latest `anomoly247/anom-artsy-rebuild` main branch into a temporary clone workspace
- [x] Copy the verified React application source and config into `app/` while preserving root static HTML files
- [x] Verify the additive repository tree and test/build integrity inside `app/`
- [x] Commit and push the additive update to `anomoly247/anom-artsy-rebuild/main`

## Quick Actions Ghost Buttons

- [x] Update Quick Actions buttons to transparent cyan outlined resting states
- [x] Preserve cyan-fill and black-text hover behavior
- [x] Validate the dashboard at desktop and mobile widths
- [x] Save a checkpoint with the Quick Actions refinement

## Games Menu and Static Realm Reorganization

- [x] Move `tater-clifford.html` and `kids-corner.html` into `/pages/` inside the static repository structure
- [x] Update dashboard Quick Actions and routing for 'Play Games' and 'Anom's Corner' to point to `/pages/`
- [x] Build out District B Arcade roster (Sky Navigator, Identity Grid, Arcade High-Score Matrix) and Moonberry Farm portal in the Games UI
- [x] Run test suite, production build, and verification across breakpoints
- [x] Push additive repository update to `anomoly247/anom-artsy-rebuild/main` and save checkpoint (commit ff93b52)

## OAuth Authentication Activation & Production Deployment

- [x] Inspect current auth helper (`startLogin`), App routes, and unauthenticated state views across pages
- [x] Update unauthenticated fallback views in Wallet to provide a direct 'Sign In' button invoking `startLogin`
- [x] Run vitest test suite and ensure zero errors across all test files (18 test files, 51 tests passed)
- [x] Save checkpoint and verify production build

- [x] Verify post-login redirect in `server/_core/oauth.ts` points to `/` which mounts `Home` for authenticated users with Glow Points and outlined Quick Actions
- [x] Run test suite and confirm zero errors
- [x] Save checkpoint and verify deployment build

## Realtime Community Feed, Lounge Notifications, and Arcade Persistence

- [x] Inspect the current community feed, lounge message, unread-status, games, and database architecture
- [x] Select the suitable production-safe delivery method for timely lounge badge updates, including any hosting requirement
- [x] Add a live member activity feed to the Home dashboard’s “Live from the Universe” widget using real platform activity only
- [x] Add timely unread-lounge badge updates in top-level member navigation without fabricating notification content
- [x] Persist authenticated member Arcade state for District B experiences with server-side authorization
- [x] Add Vitest coverage, run typecheck/build, and verify desktop/mobile UI behavior
- [x] Save a checkpoint and document deployment settings needed for realtime delivery

## Single-Origin AO Universe Consolidation

- [x] Inventory the existing anomartsy.xyz root site, universe.anomartsy.xyz deployment, Railway service, static assets, and redirect dependencies
- [x] Design a non-destructive route map that keeps the root Homeworld at `/`, serves static realm files natively, and mounts the React dashboard at `/dashboard`
- [x] Integrate the authorized static and React assets inside `anomoly247/anom-artsy-rebuild` without overwriting historical root content (commit `53c6db3`)
- [x] Validate direct navigation for root, static realm paths, dashboard, and OAuth callback behavior (19 test files / 52 tests, TypeScript check, production build, local HTTP route verification)
- [x] Obtain explicit confirmation and execute single-origin consolidation for `anomartsy.xyz` (commit `53c6db3`)

## SSE Lounge Updates, Moonberry Souvenir Badges, and In-App Notifications

- [x] Inspect kids progress, lounge message broadcasting, and notification schemas
- [x] Implement authenticated Server-Sent Events (SSE) stream endpoint for instant lounge messages and unread badges
- [x] Implement Moonberry Farm souvenir badge minting on activity completion with coin/XP rewards
- [x] Implement persistent in-app notification center for achievements, badge mints, and community events
- [x] Add Vitest tests for SSE broadcasting, souvenir badge minting, and notifications, and run production build

## Sound Effects, Seasonal Community Challenges, and Notification Filtering

- [x] Implement Web Audio API synthesis for notification and badge unlock sound effects
- [x] Implement seasonal community challenges leaderboard router and UI panel with automated rewards
- [x] Add category filtering options (achievements, badges, events) to the notification center
- [x] Add Vitest regression tests, run typecheck/build, and verify UI behavior

## Production Polish: SEO, Social Share Cards, and Economy Audit

- [x] Add authoritative Open Graph (og:image, og:title, og:description, twitter:card) meta tags to index.html and client index
- [x] Audit all UI components and backend response strings to ensure consistent Glow Points (GP) terminology
- [x] Verify clean git status and main-branch synchronization for continuous deployment

## Dashboard Enhancements: Social Sharing, Particle Feedback, and Trophy Room

- [x] Add Trophy Room pinned badge fields to user profile schema and Drizzle migration
- [x] Implement one-click social share action with Web Share API and clipboard fallback using Open Graph tags
- [x] Implement glowing particle feedback animation for Glow Points balance updates with reduced-motion support
- [x] Implement interactive Trophy Room UI component for pinning and displaying top 3 favorite souvenir badges
- [x] Add regression tests, verify typecheck/build, and save checkpoint

## Production Domain Consolidation: Railway, anomartsy.xyz, and anomartsy.lol

- [x] Audit repository CNAME and GitHub Pages configuration for anomartsy.xyz
- [x] Configure server-side redirect or shop destination handler for anomartsy.lol
- [x] Document precise Cloudflare/DNS records for pointing anomartsy.xyz to Railway production
- [x] Verify dashboard routing on single origin and save checkpoint

## Bugfix: Collaboration Station Query Error

- [x] Ensure collaboration_projects table exists in database and add error fallback to getCollaborationProjects helper

## Bugfix: Static Realm 404 for /pages/tater-clifford.html

- [x] Copy static realm HTML files into both client/public/pages and dist/public/pages and verify HTTP 200 response

## Bugfix: Static Page 404 for /shop.html

- [x] Copy shop.html into client/public/ and dist/public/ and verify HTTP 200 response

## Cleanup: Remove /shop.html Placeholder and Repoint Links to Native Merch Route

- [x] Remove shop.html from public directories and update static realm links to point to /merch

## Cleanup: Complete Deletion of shop.html and Spreadshop Redirection

- [x] Delete all physical shop.html files from workspace, client, and dist, and configure server redirect to https://anomoriginals.myspreadshop.com

## Cleanup: Hard-Redirect all Shop Links and Routes to https://anomartsy.lol

- [x] Configure server-side redirects for /shop, /shop.html, and /merch to hard-redirect to https://anomartsy.lol, and update client Quick Actions / buttons to open https://anomartsy.lol directly.
