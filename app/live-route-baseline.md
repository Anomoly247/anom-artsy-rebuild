# Live Route Baseline

Verified on 2026-08-16 UTC before the unified routing update.

| Destination | Result | Intended use in AO application |
|---|---|---|
| `https://universe.anomartsy.xyz/` | The live **Anom's Universe** application loaded successfully at the root path with a 200-class rendered response. Its primary links resolve as application routes under this domain. | Canonical external destination for the public **Enter Sanctuary** control and primary world-entry navigation originating outside the Universe app. |
| `https://anomoriginals.myspreadshop.com/` | The live **Anom Originals** Spreadshop storefront loaded successfully and displayed active product catalog controls. | Canonical external destination for public shop, store, and merch calls to action. |

The master repository currently contains a root static site and a separate React application under `app/`. This deployment pass will preserve external destinations as absolute URLs, preventing internal route fall-through from sending visitors to application 404 pages.

## Post-Push Observation

The GitHub Pages build for commit `a966c0489c4985492626d32036868176a62ed61b` completed with status `built` on 2026-08-16 UTC. An immediate browser request to `https://anomartsy.xyz/` still displayed the pre-deployment document, including `/dashboard` and `https://anomarsty.lol` links. This indicates an edge/browser cache lag rather than a source or build failure; the committed `main` branch contains the corrected absolute destinations. Follow-up verification must bypass cache or wait for the custom-domain edge cache to refresh.

## Production Verification

A cache-busted request to `https://anomartsy.xyz/?deploy=a966c04` rendered the updated **ANOM ARTSY** navigation, cyan/magenta ambient background glow, `Enter Sanctuary` absolute link to `https://universe.anomartsy.xyz/`, and storefront links to `https://anomoriginals.myspreadshop.com/`. A browser request to the legacy `https://anomartsy.xyz/dashboard/` path transferred successfully to the live Universe root rather than returning a 404.
