import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptsDir, "..");
const repositoryRoot = path.resolve(appDir, "..");
const outputDir = path.resolve(appDir, "dist", "site");

const rootFiles = [
  "index.html",
  "houses.html",
  "kids-corner.html",
  "pixel-dot.html",
  "sanctuary.html",
  "shop.html",
  "tater-clifford.html",
  "youtube.html",
];

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

await Promise.all([
  ...rootFiles.map((file) => cp(path.join(repositoryRoot, file), path.join(outputDir, file))),
  cp(path.join(repositoryRoot, "pages"), path.join(outputDir, "pages"), { recursive: true }),
  cp(path.join(repositoryRoot, "assets"), path.join(outputDir, "assets"), { recursive: true }),
]);

console.log("Prepared unified static Homeworld bundle in dist/site");
