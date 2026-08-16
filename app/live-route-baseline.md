# Live Route Baseline

Verified on 2026-08-16 UTC before the unified routing update.

| Destination | Result | Intended use in AO application |
|---|---|---|
| `https://universe.anomartsy.xyz/` | The live **Anom's Universe** application loaded successfully at the root path with a 200-class rendered response. Its primary links resolve as application routes under this domain. | Canonical external destination for the public **Enter Sanctuary** control and primary world-entry navigation originating outside the Universe app. |
| `https://anomoriginals.myspreadshop.com/` | The live **Anom Originals** Spreadshop storefront loaded successfully and displayed active product catalog controls. | Canonical external destination for public shop, store, and merch calls to action. |

The master repository currently contains a root static site and a separate React application under `app/`. This deployment pass will preserve external destinations as absolute URLs, preventing internal route fall-through from sending visitors to application 404 pages.
