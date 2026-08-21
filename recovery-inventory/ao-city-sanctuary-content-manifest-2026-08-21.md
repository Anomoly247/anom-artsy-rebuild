# AO-City and Sanctuary Content Manifest — 2026-08-21

## Purpose

This manifest defines the first approved content packet for AO-City core and the Sanctuary identity layer. It is additive: it does not replace the public Home, the `/dashboard` Universe Map, or the restored `/sanctuary` world shell. The supplied Drive/archive files remain the provenance sources; no external media is published by this manifest alone.

## Approved route spine

| Layer | Existing route | Authored content packet | Integration rule |
|---|---|---|---|
| Public entry | `https://anomartsy.xyz/` | Brand landing and navigation | Keep as the external studio landing page. Enter Sanctuary must remain a direct link to `/sanctuary`; Digital Store links remain `https://anomartsy.lol/`. |
| Sanctuary world | `/sanctuary` | AO Universe & Sanctuary shell, identity, awards, mission framing, member journey | Preserve the recovered neon world page. Add authored content as panels/data records, not a replacement page. |
| AO-City map | `/dashboard` | Living Map with AO-City and six community nodes | Preserve the current Map interaction and route targets. Add approved descriptions, media, mission signals, and readiness states to existing nodes. |
| Heartfield Commons | `/dashboard` | Community welcome, Clifford guide, constructive missions | Treat as a live community destination with Guardian-moderated authored copy and mission records. |
| Snack Quarter | `/games` | Tater Nugget guide, playful discovery, earned Anom Coin | Use game metadata and reward definitions; keep Anom Coin and Social Good Score distinct. |
| Financial District | `/financial-district` | Security Bot X-9, financial literacy, good-action score | Add lessons only after authenticated route behavior and Guardian review are verified. |
| Neon Gallery | `/work` or `/neon-gallery` | Curated identity art and creator work | Publish only approved media with attribution, source lineage, and review status. |
| Broadcast Tower | `/broadcast` | Cross-world announcements and curated media | Add release records and approved assets; do not auto-publish Drive media. |
| The Core | `/dashboard` | AO symbol, missions, coins, Social Good Score | Represent the platform-level system without conflating spendable Coin with impact scoring. |

## Sanctuary identity packet

| Content object | Placement | Status | Required provenance/review |
|---|---|---|---|
| Sanctuary identity art | Sanctuary hero/background panel | Candidate source in recovered archive and Drive materials | Record source file, owner, intended-use status, and media safety review before publication. |
| Member identity framing | Sanctuary hero and profile journey | Approved concept from restored page | Keep server-confirmed identity state; do not grant access from browser-only state. |
| Awards and recognition | Sanctuary profile/mission panel | Candidate content from current routes and master specification | Define award key, issuer, criteria, timestamp, and Guardian approval state. |
| Mission prompts | Heartfield Commons and The Core | Candidate authored content | Store as reviewed mission records with Social Good impact metadata; Coin rewards require server confirmation. |
| Anom Coin framing | Sanctuary economy panel and Store links | Approved | Spendable balance remains separate from Social Good Score. Transactions remain ledger-backed and idempotent. |
| Social Good Score framing | Sanctuary mission/status panel | Approved | Score reflects verified impact/actions and is not cash, Coin, or a payment balance. |
| Profile customization | Sanctuary/profile routes | Approved platform direction | Users choose from platform controls only; no user-authored code or arbitrary HTML/CSS. |
| Guardian review | Authored media, awards, missions, Store items | Required gate | Keep review status, reviewer identity, decision, attribution, provenance, and decision timestamp. |

## Source register

| Source | Drive/repository provenance | Use |
|---|---|---|
| `ao_universe_master_specification` | Drive PDF/DOCX export; extracted read-only | Conceptual system, AO-City divisions, identity language, economy concepts, and legacy technical notes. |
| `AO_Universe_Reconciliation_and_Build_Plan.md` | Drive Google Doc | Reconciliation priorities and build sequencing. |
| `Universe Map Route and Content Inventory` | Drive Markdown export | Verified route-to-content destinations and readiness state. |
| `Sanctuary_Safety_Layer_Work_Order.md` | Drive Google Doc | Guardian, safety, moderation, and media review requirements. |
| `Sanctuary_ToS_Privacy_Draft.md` | Drive Google Doc | Legal/privacy source material; not copied into UI without review. |
| `anom-social-sanctuary-complete.zip` | Drive archive | Recovered Sanctuary React source and visual shell; already restored as `/sanctuary`. |
| Current AO repository | `Anomoly247/anom-artsy-rebuild` | Runtime routes, schema, server-confirmed access, and Guardian workflow implementation. |

## Legacy/conflicting material held back

The master specification contains older references to physical merchandise, Printful shipping, cash top-ups, and an alternate PostgreSQL schema. Those references are historical planning material and are **not approved for this build**. The active product contract is digital-only Store goods, the existing MySQL/TiDB schema, server-confirmed access, and Guardian review. They must not be copied into the current UI, migrations, payment flow, or production route behavior.

## Integration order

The first implementation pass should add AO-City node metadata and Sanctuary identity records to the existing route surfaces. The second pass should add approved art/media references with explicit review state. The third pass should connect mission completion and awards to server-confirmed ledger records. Family-safe worlds, Moonberry Farm, Pixel & Dot, and Clifford & Tater remain subsequent packets rather than being mixed into this first change.

## Non-destructive acceptance criteria

The packet is acceptable only if `/`, `/sanctuary`, and `/dashboard` remain distinct; all content objects retain source and ownership metadata; unpublished media remains unserved; Guardian review is required for authored public content; users cannot inject code; Anom Coin remains separate from Social Good Score; and the digital Store remains the only purchase destination.
