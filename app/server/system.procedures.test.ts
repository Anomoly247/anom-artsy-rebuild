import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";

type Role = "admin" | "user";

function createContext(role: Role): TrpcContext {
  const now = new Date();
  return {
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
    user: {
      id: 1,
      openId: "owner-open-id",
      name: "Owner",
      email: "owner@example.com",
      loginMethod: "google",
      role,
      status: "active",
      createdAt: now,
      updatedAt: now,
      lastSignedIn: now,
    },
  };
}

describe("system admin procedures", () => {
  it("exposes read-only admin dashboard procedures with stable result shapes", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    const [stats, users, events] = await Promise.all([
      caller.system.getStats(),
      caller.system.getAllUsers(),
      caller.system.getEvents(),
    ]);

    expect(stats).toMatchObject({
      totalUsers: expect.any(Number),
      activeMembers: expect.any(Number),
      totalLounges: expect.any(Number),
      achievementsUnlocked: expect.any(Number),
    });
    expect(Array.isArray(users)).toBe(true);
    expect(Array.isArray(events)).toBe(true);
  });

  it("rejects non-admin sessions before querying dashboard data", async () => {
    const caller = appRouter.createCaller(createContext("user"));

    await expect(caller.system.getStats()).rejects.toMatchObject<Partial<TRPCError>>({
      code: "FORBIDDEN",
    });
    await expect(caller.system.getAllUsers()).rejects.toMatchObject<Partial<TRPCError>>({
      code: "FORBIDDEN",
    });
    await expect(caller.system.getEvents()).rejects.toMatchObject<Partial<TRPCError>>({
      code: "FORBIDDEN",
    });
  });
});
