import { describe, expect, it } from "vitest";
import { buildModerationUndoOperations } from "../shared/moderationUndo";

describe("moderation undo operations", () => {
  it("reverses an individual role or status change to its captured prior value", () => {
    expect(buildModerationUndoOperations({ kind: "role", userId: 7, userLabel: "Ari", previousRole: "user" })).toEqual([{ userId: 7, role: "user" }]);
    expect(buildModerationUndoOperations({ kind: "status", userId: 8, userLabel: "Bee", previousStatus: "active" })).toEqual([{ userId: 8, status: "active" }]);
  });

  it("preserves the exact selected order for bulk rollback operations", () => {
    expect(buildModerationUndoOperations({
      kind: "bulk-role",
      changes: [
        { userId: 8, userLabel: "Bee", previousRole: "user" },
        { userId: 7, userLabel: "Ari", previousRole: "admin" },
      ],
    })).toEqual([{ userId: 8, role: "user" }, { userId: 7, role: "admin" }]);

    expect(buildModerationUndoOperations({
      kind: "bulk-status",
      changes: [{ userId: 8, userLabel: "Bee", previousStatus: "active" }],
    })).toEqual([{ userId: 8, status: "active" }]);
  });
});
