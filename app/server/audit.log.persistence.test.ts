import { afterEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { auditLog } from "../drizzle/schema";
import { createAuditLog, getAuditLogs, getFilteredAuditLogs, getDb, getUserById } from "./db";

const testAction = `test_audit_persistence_${Date.now()}_${Math.random().toString(36).slice(2)}`;

describe("audit log persistence", () => {
  afterEach(async () => {
    const db = await getDb();
    if (db) {
      await db.delete(auditLog).where(eq(auditLog.action, testAction));
    }
  });

  it("persists and retrieves an admin moderation audit entry", async () => {
    const db = await getDb();
    if (!db) return;

    await createAuditLog({
      userId: 1,
      action: testAction,
      entityType: "user",
      entityId: 7,
      details: {
        targetEmail: "audit-target@example.com",
        previousStatus: "active",
        newStatus: "suspended",
      },
    });

    const actor = await getUserById(1);
    const logs = await getAuditLogs(1000);
    const persisted = logs.find((log) => log.action === testAction);
    const filtered = await getFilteredAuditLogs({
      adminId: 1,
      actionType: testAction,
      targetUserQuery: "audit-target@example.com",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2027-01-01T00:00:00.000Z"),
      limit: 1,
      offset: 0,
    });

    expect(persisted).toMatchObject({
      userId: 1,
      entityType: "user",
      entityId: 7,
      userEmail: actor?.email ?? null,
    });
    expect(persisted?.details).toMatchObject({
      targetEmail: "audit-target@example.com",
      newStatus: "suspended",
    });
    expect(filtered.total).toBe(1);
    expect(filtered.logs).toHaveLength(1);
    expect(filtered.logs[0]?.action).toBe(testAction);
  });
});
