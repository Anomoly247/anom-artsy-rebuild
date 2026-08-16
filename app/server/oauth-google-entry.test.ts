import { createServer } from "node:http";
import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import { registerOAuthRoutes } from "./_core/oauth";

const servers: ReturnType<typeof createServer>[] = [];

afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => new Promise<void>((resolve) => server.close(() => resolve()))));
});

async function requestGoogleAuthRoute() {
  const app = express();
  registerOAuthRoutes(app);
  const server = createServer(app);
  servers.push(server);

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Test server failed to start");

  return fetch(`http://127.0.0.1:${address.port}/api/auth/google`, { redirect: "manual" });
}

describe("Google OAuth entry route", () => {
  it("returns a server JSON response when OAuth configuration is absent", async () => {
    const response = await requestGoogleAuthRoute();

    expect(response.status).toBe(503);
    expect(response.headers.get("content-type")).toContain("application/json");
    await expect(response.json()).resolves.toEqual({ error: "Google OAuth is not configured" });
  });
});
