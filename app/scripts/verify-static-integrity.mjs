import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDir, "../..");
const shopUrl = "https://anomartsy.lol/";
const sanctuaryUrl = "https://universe.anomartsy.xyz/sanctuary";
const universeMapUrl = "https://universe.anomartsy.xyz/dashboard";
const retiredShopHosts = [
  ["anomoriginals", "myspreadshop", "com"].join("."),
  ["anomarsty", "lol"].join("."),
];

const publicFiles = [
  "index.html",
  "houses.html",
  "kids-corner.html",
  "pixel-dot.html",
  "sanctuary.html",
  "shop.html",
  "store.html",
  "merch.html",
  "tater-clifford.html",
  "youtube.html",
  "pages/kids-corner.html",
  "pages/tater-clifford.html",
  "pages/sanctuary.html",
  "pages/store.html",
  "dashboard/index.html",
  "sanctuary/index.html",
  "shop/index.html",
  "store/index.html",
  "merch/index.html",
];

const checks = [];
for (const relativePath of publicFiles) {
  const source = await readFile(path.join(repositoryRoot, relativePath), "utf8");
  if (retiredShopHosts.some((host) => source.includes(host))) {
    checks.push(`${relativePath}: contains a retired or misspelled shop destination`);
  }
  if (/href="\/(?:dashboard|shop\.html|store\.html|merch\.html)"/.test(source)) {
    checks.push(`${relativePath}: contains a legacy internal commerce or Sanctuary link`);
  }
  for (const assetPath of source.matchAll(/src="(\/assets\/[^"?#]+)"/g)) {
    try {
      await access(path.join(repositoryRoot, assetPath[1]));
    } catch {
      checks.push(`${relativePath}: missing root asset ${assetPath[1]}`);
    }
  }
}

const reactPublicFiles = [
  "app/client/public/pages/kids-corner.html",
  "app/client/public/pages/tater-clifford.html",
];
for (const relativePath of reactPublicFiles) {
  const source = await readFile(path.join(repositoryRoot, relativePath), "utf8");
  if (source.includes('src="assets/')) checks.push(`${relativePath}: contains a relative asset path`);
  if (source.includes('href="/shop.html"')) checks.push(`${relativePath}: contains a legacy shop path`);
  for (const assetPath of source.matchAll(/src="(\/assets\/[^"?#]+)"/g)) {
    try {
      await access(path.join(repositoryRoot, "app", "client", "public", assetPath[1]));
    } catch {
      checks.push(`${relativePath}: missing bundled asset ${assetPath[1]}`);
    }
  }
}

const root = await readFile(path.join(repositoryRoot, "index.html"), "utf8");
if (!root.includes(`href="${sanctuaryUrl}">Enter Sanctuary`)) checks.push("index.html: Enter Sanctuary is not a direct Sanctuary destination");
if (!root.includes(`href="${universeMapUrl}">Universe Map`) && !root.includes(`href="${universeMapUrl}">Sanctuary Dashboard`)) checks.push("index.html: Universe Map is not a direct Map destination");
if (!root.includes(`href="${shopUrl}">Digital Store`) && !root.includes(`href="${shopUrl}">SHOP`)) checks.push("index.html: primary digital Store navigation is not a direct storefront destination");
if (!root.includes("radial-gradient")) checks.push("index.html: cyberpunk background glow is missing");

if (checks.length > 0) {
  console.error(checks.join("\n"));
  process.exit(1);
}

console.log("Static route, visual asset, and fallback integrity checks passed.");
