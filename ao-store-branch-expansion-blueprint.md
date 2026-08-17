# AO Store Branch Expansion Blueprint

## Purpose

The Store is an additive destination branch inside the AO Universe. It gives the build room for commerce-related worlds without changing the locked homepage, the Universe Map router, or the actual storefront hosted at `anomartsy.lol`.

## Route tree

| Route | Purpose | Initial status |
|---|---|---|
| `/store` | Store world landing page and gateway to the actual Anom Artsy storefront | Implemented |
| `/shop` | Compatibility route that opens the Store world | Implemented |
| `/merch` | Compatibility route that opens the Store world | Implemented |
| `/store/collections` | Curated product and digital-art collections | Planned |
| `/store/identity` | Identity pieces, profile art, avatars, and creator artifacts | Planned |
| `/store/world-artifacts` | World-specific goods tied to Anom’s Corner, District B, Clifford & Tater, and other destinations | Planned |
| `/store/missions` | Mission-linked goods and Social Good explanations | Planned |
| `/store/library` | Downloadable approved digital resources and media extras | Planned |
| `/store/orders` | Authenticated order history or external-store handoff status | Planned |

## Boundary between AO and the actual store

The AO application owns discovery, storytelling, provenance, collection presentation, Guardian review, identity context, and mission/impact messaging. The actual storefront at `anomartsy.lol` owns product availability, checkout, payment, shipping, tax, and order fulfillment until those functions are intentionally implemented in the application.

Do not duplicate prices, inventory, or checkout state in the AO frontend unless a trusted commerce integration is added. The first implementation should use curated product metadata and a clear handoff to the actual store. This keeps the build useful now without creating contradictory inventory systems.

## Shared identity and ledger rules

Store activity must not create a second wallet. Anom Coin remains the single spendable balance across missions, lounges, games, and approved participation. Social Good Score remains a distinct impact measure and must never be presented as currency. Optional future store events can record provenance or contribution credit, but purchases must not automatically inflate Social Good Score without an explicit approved policy.

## Content and media rules

Every collection image, product mockup, video, or download receives a source ID, authored path, privacy state, Guardian status, caption or alt text, and checksum. Unreviewed external media must not render publicly. Store assets should use the same midnight base, serif display typography, cyan/magenta/gold accents, and interlocking living-world background as the rest of AO.

## Implementation sequence

1. Keep the current Store gateway stable and verify its routes.
2. Add a typed collection registry with title, description, route, source ID, media records, and external destination URL.
3. Add one reviewed Anom Originals collection using local media and Guardian approval.
4. Add world-artifact links from Anom’s Corner and District B without replacing their existing destination routes.
5. Add authenticated order-history or handoff status only after the commerce provider and privacy model are confirmed.
6. Add mission-linked product messaging after the Social Good policy is written and approved.

## Production gates

A Store expansion is ready only when the homepage remains unchanged, `/store`, `/shop`, and `/merch` all work, external checkout opens only from an intentional user action, no raw provider credentials are exposed, all visible assets are reviewed, keyboard and contrast checks pass, and the production build plus route smoke suite passes.

## Owner-built operating model

Build one collection at a time. Treat each collection as a small vertical slice: authored source → manifest → Guardian review → Store presentation → external storefront handoff → route and accessibility evidence. This keeps the branch manageable without investors or outside developers and creates a repeatable pattern for the rest of the AO Universe.
