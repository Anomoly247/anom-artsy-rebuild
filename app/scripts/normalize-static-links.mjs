import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDir, "../..");
const shopUrl = "https://anomartsy.lol/";
const universeUrl = "https://universe.anomartsy.xyz/";

const files = [
  "houses.html",
  "kids-corner.html",
  "pixel-dot.html",
  "tater-clifford.html",
  "youtube.html",
  "pages/about.html",
  "pages/gallery.html",
  "pages/index.html",
  "pages/kids-corner.html",
  "pages/store.html",
  "pages/tater-clifford.html",
];

const replacements = [
  [/https:\/\/anomarsty\.lol/g, shopUrl],
  [/https:\/\/anomartsy\.lol/g, shopUrl],
  [/href="\/shop\.html(?:#[^"]*)?"/g, `href="${shopUrl}"`],
  [/href="\/store\.html(?:#[^"]*)?"/g, `href="${shopUrl}"`],
  [/href="\/merch\.html(?:#[^"]*)?"/g, `href="${shopUrl}"`],
  [/href="\/dashboard"/g, `href="${universeUrl}"`],
  [/href="\/sanctuary\.html"/g, `href="${universeUrl}"`],
  [/href="\/kids-corner\.html"/g, 'href="/pages/kids-corner.html"'],
];

for (const relativePath of files) {
  const absolutePath = path.join(repositoryRoot, relativePath);
  let source = await readFile(absolutePath, "utf8");
  for (const [pattern, replacement] of replacements) {
    source = source.replace(pattern, replacement);
  }
  await writeFile(absolutePath, source);
}

console.log(`Normalized routes in ${files.length} designed static pages.`);
