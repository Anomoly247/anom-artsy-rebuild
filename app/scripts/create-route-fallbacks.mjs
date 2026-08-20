import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDir, "../..");

const routes = [
  { file: "sanctuary.html", destination: "https://universe.anomartsy.xyz/", label: "Anom's Universe" },
  { file: "pages/sanctuary.html", destination: "https://universe.anomartsy.xyz/", label: "Anom's Universe" },
  { file: "shop.html", destination: "https://anomartsy.lol/", label: "the AO digital Store" },
  { file: "store.html", destination: "https://anomartsy.lol/", label: "the AO digital Store" },
  { file: "merch.html", destination: "https://anomartsy.lol/", label: "the AO digital Store" },
  { file: "pages/store.html", destination: "https://anomartsy.lol/", label: "the AO digital Store" },
  { file: "kids-corner.html", destination: "/pages/kids-corner.html", label: "Kids Corner" },
  { file: "dashboard/index.html", destination: "https://universe.anomartsy.xyz/", label: "Anom's Universe" },
  { file: "sanctuary/index.html", destination: "https://universe.anomartsy.xyz/", label: "Anom's Universe" },
  { file: "shop/index.html", destination: "https://anomartsy.lol/", label: "the AO digital Store" },
  { file: "store/index.html", destination: "https://anomartsy.lol/", label: "the AO digital Store" },
  { file: "merch/index.html", destination: "https://anomartsy.lol/", label: "the AO digital Store" },
];

function renderRedirect(destination, label) {
  const safeDestination = destination.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, follow">
  <meta http-equiv="refresh" content="0;url=${safeDestination}">
  <title>Connecting to ${label} | Anom Artsy</title>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body { min-height: 100vh; margin: 0; display: grid; place-items: center; overflow: hidden; background: #03050c; color: #f6fbff; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    body::before { content: ""; position: fixed; inset: 0; pointer-events: none; background: radial-gradient(circle at 20% 20%, rgba(32,205,226,.18), transparent 34%), radial-gradient(circle at 80% 70%, rgba(232,83,220,.15), transparent 36%), linear-gradient(rgba(32,205,226,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(32,205,226,.05) 1px, transparent 1px); background-size: auto, auto, 42px 42px, 42px 42px; }
    main { position: relative; width: min(92vw, 560px); padding: 2.5rem; text-align: center; border: 1px solid rgba(32,205,226,.65); border-radius: 1rem; background: rgba(3,5,12,.88); box-shadow: 0 0 54px rgba(32,205,226,.24); backdrop-filter: blur(12px); }
    p { margin: 0 0 1rem; color: #b8c5d6; line-height: 1.6; }
    .eyebrow { color: #d7ab4e; font-size: .72rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; }
    h1 { margin: .5rem 0 1rem; color: #20cde2; font-family: Georgia, serif; font-size: clamp(2rem, 8vw, 3rem); }
    a { display: inline-block; margin-top: .5rem; padding: .8rem 1.2rem; border: 1px solid #20cde2; border-radius: 999px; color: #20cde2; font-weight: 700; text-decoration: none; }
    a:hover, a:focus-visible { background: #20cde2; color: #03050c; }
  </style>
  <script>window.location.replace(${JSON.stringify(destination)});</script>
</head>
<body>
  <main>
    <p class="eyebrow">Anom Artsy Connection</p>
    <h1>Opening ${label}</h1>
    <p>You are being connected to the live Anom Originals experience.</p>
    <a href="${safeDestination}">Continue now</a>
  </main>
</body>
</html>
`;
}

for (const route of routes) {
  const output = path.join(repositoryRoot, route.file);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, renderRedirect(route.destination, route.label));
}

console.log(`Created ${routes.length} branded route fallbacks.`);
