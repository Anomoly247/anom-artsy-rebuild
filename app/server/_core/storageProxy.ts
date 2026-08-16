import type { Express } from "express";
import { ENV } from "./env";

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    // Check if file exists in public/manus-storage first
    const path = await import("path");
    const fs = await import("fs/promises");
    const publicPath = path.join(process.cwd(), "client", "public", "manus-storage", key);
    
    try {
      const localFile = await fs.stat(publicPath);
      if (localFile.isFile() && localFile.size > 0) {
        // Only serve complete local files. Empty placeholders must fall through
        // so a real Forge-backed object can be used when available.
        res.sendFile(publicPath);
        return;
      }

      console.warn(`[StorageProxy] Ignoring empty local file: ${key}`);
    } catch (e) {
      // File not found locally, proceed to proxy.
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      console.warn("[StorageProxy] Forge credentials missing, returning 404 for missing local file");
      res.status(404).send("File not found");
      return;
    }

    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
      );
      forgeUrl.searchParams.set("path", key);

      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
      });

      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }

      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }

      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
