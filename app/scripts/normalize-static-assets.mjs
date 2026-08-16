import { cp, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDir, "../..");

const pageFiles = [
  "pages/kids-corner.html",
  "pages/tater-clifford.html",
  "app/client/public/pages/kids-corner.html",
  "app/client/public/pages/tater-clifford.html",
];

for (const relativePath of pageFiles) {
  const absolutePath = path.join(repositoryRoot, relativePath);
  const source = await readFile(absolutePath, "utf8");
  await writeFile(absolutePath, source.replaceAll('src="assets/', 'src="/assets/'));
}

await cp(path.join(repositoryRoot, "assets", "backgrounds"), path.join(repositoryRoot, "app", "client", "public", "assets", "backgrounds"), { recursive: true, force: true });
await cp(path.join(repositoryRoot, "assets", "achievements"), path.join(repositoryRoot, "app", "client", "public", "assets", "achievements"), { recursive: true, force: true });

console.log("Normalized static asset paths and mirrored shared visual assets into the React public bundle.");
