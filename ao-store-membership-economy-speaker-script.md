# AO Store Membership and Economy — Internal Speaker Script

## Slide 1 — The Store becomes an AO world

This next phase gives the AO Universe a dedicated economy branch. The Store is not a replacement for the homepage, the Universe Map, or the existing story worlds. It is the place where approved memberships, identity enhancements, backgrounds, glow treatments, decorations, digital collections, and future store-linked goods can live together. The actual storefront remains at `anomartsy.lol`, while the AO application owns the discovery, context, identity, provenance, and server-confirmed access experience. The authored work remains the creator's work; the application records only which approved Store customizations an account may use.

## Slide 2 — Why we need a Store branch

Without a dedicated Store branch, commerce links become scattered across the build and every page has to make its own assumptions about products, memberships, or customization. The Store gives us one controlled destination. It gives users a clear place to preview what they can unlock, understand the meaning of each item, and return to their worlds without losing context. This is an owner-built system: we can add one small reviewed collection at a time instead of trying to build an entire marketplace at once.

## Slide 3 — Four systems that must stay separate

There are four related but distinct systems. Membership describes access tiers and privileges. Anom Coin is the shared spendable balance earned through approved participation and used for eligible unlocks. Social Good Score is an impact measure, not currency, and it cannot be silently increased by a purchase. Server-confirmed access records indicate which approved customizations a person may use. They are separate from authorship and ownership, and they keep the economy understandable and auditable.

## Slide 4 — What users can customize

The first catalog categories are structured choices, not open-ended code or uploads. A user might choose an AO midnight background, a Moonberry Farm scene, a cyan thread glow, a gold mission accent, an identity frame, a profile decoration, or additional approved storage. Each choice is presented as a real object in the catalog with a name, description, preview, price or membership requirement, provenance, and Guardian status.

## Slide 5 — The safe unlock flow

The frontend can show a preview, but it cannot grant ownership by itself. The user selects an approved catalog item. The server checks that it is published and Guardian-approved, checks the Coin price, confirms the user’s balance, writes the Coin transaction, and creates a server-confirmed access record. If the user already has access, the system returns the existing record rather than charging again. Afterward, the client refreshes the access list and applies only what the server confirms.

## Slide 6 — The preview component

The preview component is the first visible piece of the Store economy. It uses the AO semantic tokens and the living-world background. Backgrounds are shown inside bounded containers with readable overlays. Glow treatments use known token classes rather than arbitrary user-provided classes. When the catalog is empty in a local environment, the component shows safe preview-only samples so the Store still communicates the intended experience without pretending that an item is purchasable.

## Slide 7 — Guardian and provenance remain in control

Payment or Coin balance never bypasses Guardian review. A catalog item must be connected to its authored source record, privacy state, checksum, caption or alt text, and approval status. Pending and rejected items do not appear as unlockable catalog items. This controls availability and provenance; it does not transfer ownership of the authored work. This protects the creative work and keeps the Store aligned with the same authorship and moderation standards as every other AO world.

## Slide 8 — The first vertical economy slice

The first implementation slice should stay small: one approved background, one glow treatment, and one membership tier. We should verify preview, balance, unlock, entitlement, apply, remove, and Social Good separation. Once that path works locally and passes type, build, route, accessibility, and migration checks, we can add more collections. The goal is not to make the Store enormous immediately. The goal is to establish a reliable pattern that lets the AO Universe grow safely, one reviewed world layer at a time.
