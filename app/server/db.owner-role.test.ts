import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  drizzle: vi.fn(),
  insert: vi.fn(),
  values: vi.fn(),
  onDuplicateKeyUpdate: vi.fn(),
}));

vi.mock("drizzle-orm/mysql2", () => ({
  drizzle: mocks.drizzle,
}));

import { upsertUser } from "./db";

describe("upsertUser owner role assignment", () => {
  beforeEach(() => {
    mocks.onDuplicateKeyUpdate.mockResolvedValue(undefined);
    mocks.values.mockReturnValue({
      onDuplicateKeyUpdate: mocks.onDuplicateKeyUpdate,
    });
    mocks.insert.mockReturnValue({ values: mocks.values });
    mocks.drizzle.mockReturnValue({ insert: mocks.insert });
  });

  it("assigns admin to the configured owner open ID", async () => {
    const ownerOpenId = process.env.OWNER_OPEN_ID;
    expect(ownerOpenId).toBeTruthy();

    await upsertUser({
      openId: ownerOpenId!,
      name: "Owner",
      email: "owner@example.com",
      loginMethod: "google",
    });

    const insertedValues = mocks.values.mock.calls[0]?.[0] as {
      role?: string;
    };
    const updateSet = mocks.onDuplicateKeyUpdate.mock.calls[0]?.[0]?.set as {
      role?: string;
    };

    expect(insertedValues.role).toBe("admin");
    expect(updateSet.role).toBe("admin");
  });
});
