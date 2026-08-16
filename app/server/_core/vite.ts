import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const dashboardDistPath = path.resolve(import.meta.dirname, "public");
  const siteDistPath = path.resolve(import.meta.dirname, "site");

  if (!fs.existsSync(dashboardDistPath)) {
    console.error(
      `Could not find the dashboard build directory: ${dashboardDistPath}, make sure to build the client first`
    );
  }
  if (!fs.existsSync(siteDistPath)) {
    console.error(
      `Could not find the static Homeworld directory: ${siteDistPath}, make sure to run the unified build first`
    );
  }

  app.use("/dashboard", express.static(dashboardDistPath));
  app.get(["/dashboard", "/dashboard/*"], (_req, res) => {
    res.sendFile(path.resolve(dashboardDistPath, "index.html"));
  });

  // The root origin stays a native static Homeworld. This includes /pages/* realm
  // documents and preserves legacy root HTML aliases during the transition.
  app.use(express.static(siteDistPath));
  app.use((_req, res) => {
    res.status(404).sendFile(path.resolve(siteDistPath, "index.html"));
  });
}
