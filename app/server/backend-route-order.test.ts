import { createServer } from "node:http";
import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import { registerBackendRoutes } from "./_core/backendRoutes";

const servers: ReturnType<typeof createServer>[] = [];

afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => new Promise<void>((resolve) => server.close(() => resolve()))));
});

async function request(path: string) {
  const app = express();
  registerBackendRoutes(app);
  app.get("*", (_req, res) => res.type("html").send("<html>SPA fallback</html>"));

  const server = createServer(app);
  servers.push(server);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Test server failed to start");

  return fetch(`http://127.0.0.1:${address.port}${path}`, { redirect: "manual" });
}

describe("backend route registration order", () => {
  it("handles Google OAuth before the SPA fallback", async () => {
    const response = await request("/api/auth/google");

    expect(response.status).toBe(503);
    expect(response.headers.get("content-type")).toContain("application/json");
    await expect(response.json()).resolves.toEqual({ error: "Google OAuth is not configured" });
  });

  it("returns JSON for unknown API paths while preserving client fallback routes", async () => {
    const apiResponse = await request("/api/missing-route");
    expect(apiResponse.status).toBe(404);
    expect(apiResponse.headers.get("content-type")).toContain("application/json");
    await expect(apiResponse.json()).resolves.toEqual({ error: "API route not found" });

    const clientResponse = await request("/owner");
    expect(clientResponse.status).toBe(200);
    await expect(clientResponse.text()).resolves.toContain("SPA fallback");
  });
});
