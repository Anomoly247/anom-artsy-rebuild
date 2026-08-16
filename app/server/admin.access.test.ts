import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { adminProcedure, router } from "./_core/trpc";
import type { TrpcContext } from "./_core/context";

type Role = "admin" | "user";

const guardedRouter = router({
  guarded: adminProcedure.query(({ ctx }) => ({ role: ctx.user.role })),
});

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

describe("admin access guard", () => {
  it("allows an admin session through", async () => {
    await expect(
      guardedRouter.createCaller(createContext("admin")).guarded(),
    ).resolves.toEqual({ role: "admin" });
  });

  it("rejects a regular user session", async () => {
    await expect(
      guardedRouter.createCaller(createContext("user")).guarded(),
    ).rejects.toMatchObject<Partial<TRPCError>>({ code: "FORBIDDEN" });
  });
});
