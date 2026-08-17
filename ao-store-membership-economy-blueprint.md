# AO Store Membership and Customization Economy

## Core model

The Store branch is the economy and membership layer of the AO Universe. It should sell or unlock approved enhancements while the rest of the Universe remains focused on identity, stories, communities, missions, and play.

| System | Meaning | Allowed uses | Must not do |
|---|---|---|---|
| Membership | A user’s access tier and privileges | Extra backgrounds, storage, decorations, profile options, curated lounges, early content | Replace Guardian review or grant unrestricted publishing |
| Anom Coin | The shared in-world balance | Unlocking approved backgrounds, glow treatments, decorations, profile upgrades, mission rewards, game rewards | Be treated as Social Good Score or silently convert purchases into impact |
| Social Good Score | Separate impact/prosocial measure | Displaying contribution and approved community impact | Function as currency or be bought directly |
| Purchase entitlement | A durable record of what the user owns or can use | Membership tier, pack, background, glow, decoration, storage allowance | Be inferred only from frontend state |
| Guardian review | Safety/provenance gate | Approving media, products, copy, decorations, and world assets | Be bypassed by payment or membership |

## Customization categories

The first Store customization catalog should use structured choices only. Users should never enter code or inject arbitrary markup.

| Category | Example | Delivery model |
|---|---|---|
| Backgrounds | AO midnight web, Moonberry Farm, neon city, world-specific scenes | Coin unlock or membership entitlement |
| Glow treatments | Cyan halo, magenta orbit, gold mission ring | Coin unlock or membership tier |
| Profile identity | Frames, badges, Being labels, approved avatar treatments | Coin unlock with Guardian-approved assets |
| Decorations | Stickers, approved animated accents, photo-grid ornaments | Coin pack or membership entitlement |
| Storage | Additional approved photo/media capacity | Membership tier or purchased pack |
| Lounges | Premade social spaces and themed rooms | Membership access plus Guardian moderation |
| Digital collections | Wallpapers, art packs, story extras, downloadable resources | Purchase entitlement and review-gated delivery |

## Safe transaction flow

1. The user selects a product, membership, or customization pack in the Store.
2. The server creates a pending order or entitlement request; the frontend never grants access by itself.
3. Payment completion or a valid Anom Coin spend is verified server-side.
4. The server writes an immutable entitlement record and, when relevant, a separate Anom Coin ledger event.
5. The client refreshes the user’s entitlement list and renders only approved choices.
6. Guardian review remains required for any authored media, community decoration, or new world asset.
7. Social Good Score changes only through explicit mission or community-impact events, never as an automatic side effect of a purchase.

## Suggested data boundaries

```text
membership_plans
membership_entitlements
store_catalog_items
store_orders
store_order_events
user_entitlements
coin_ledger
social_good_events
guardian_reviews
```

`coin_ledger` and `social_good_events` must remain separate tables and separate UI surfaces. `user_entitlements` should reference the catalog item and the source order or coin transaction that granted it. Every catalog item should include an approval status, provenance fields, and an availability state.

## First implementation slice

Start with three safe items:

1. One AO background that can be previewed and unlocked with Anom Coin.
2. One glow treatment that is cosmetic only and does not alter permissions.
3. One membership tier that increases approved storage or decoration choices without bypassing moderation.

The first slice is complete when a test user can preview an item, spend or earn Coin through the existing ledger, receive a server-confirmed entitlement, apply the cosmetic choice, remove it, and see Social Good Score remain unchanged unless a separate impact event occurred.

## Product and social-good boundary

The Store can fund the platform and support Anom Originals, but the social-good identity must remain honest. Purchases can be described as supporting the build, while impact claims should be tied only to documented missions, community actions, or explicitly defined contribution events. This keeps the economy understandable, auditable, and aligned with the AO world.
