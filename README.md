# ANOMS UNIVERSE - anomartsy.xyz Homeworld
Elizabeth Wood DBA Anom Originals

This is the ONE repo - `anom-artsy-rebuild` style - that wires everything together.

## Universe Map (from your built-on ideas)

Homeworld: anomartsy.xyz

Realms:
- / -> Art & Identity - Anom Originals neon identity art
- /pages/kids-corner.html -> Anoms Corner - Moonberry Farm, Pixel & Dot
- /pages/tater-clifford.html -> Security Division - Role-Swap Day + Walmart Work + mission
- /sanctuary.html -> Sanctuary social platform placeholder (profiles, coin economy, lounges)
- /dashboard -> React member dashboard (Manus OAuth, Glow Points, lounges, games)
- /store.html -> redirects to Spreadshop, later anomartsy.lol
- /gallery.html -> art vault
- /about.html -> brand story

## Assets (your rewards / decorations vault)
Pulled from Anoms-Hub/anom-artsy - this is where your whole economy lives:
- assets/achievements/ -> achievement badges
- assets/bling/ -> bling tier
- assets/moods/ -> mood collection (blush-bubble etc)
- assets/potions/ -> potions
- assets/crowns/ -> crowns
- assets/ghosts/ -> ghosts (expressive assets)
- assets/hearts/ -> hearts
- assets/special/ -> special / Anomoly tier
- assets/backgrounds/ -> 4K headers, profile pics
- assets/brand/ -> from ANOMS-Brand-Kit (logos, colors, typography)

## Unified production build
- The repository root remains the native static Homeworld at `/`.
- The Node server in `app/` copies the root static site and `/pages/` realm files into its production bundle.
- The React member application is mounted at `/dashboard` and keeps all internal SPA routes below that path.
- OAuth callbacks land at `/dashboard`, so authenticated members do not fall back onto the public Homeworld.

## Brand
Anom Originals • Identity in Every Pixel
Colors: neon on black, your brand kit
Emails: anom@anomartsy.xyz (public), eliza@ (owner), loved@ (moderator)

## How this wires
GitHub: Make this the primary: Anomoly247/anom-artsy-rebuild -> push this folder there
Archive: Anoms-Hub stays as library/archive, no more deploys from it
Domain: anomartsy.xyz Pages points here
Store: anomoriginals.myspreadshop.com -> later consolidate rtsy/rsty to one

## Next to do
1. Copy real assets from Anoms-Hub/anom-artsy/assets/* into assets/*
2. Copy brand files from ANOMS-Brand-Kit into assets/brand/
3. Move Tater & Clifford + Moonberry html into pages/
4. Deploy
