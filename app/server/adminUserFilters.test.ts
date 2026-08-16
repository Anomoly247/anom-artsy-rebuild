import { describe, expect, it } from "vitest";
import { filterAdminUsers, isAdminUserActive, selectAdminUsers, type AdminUserSummary } from "../shared/adminUserFilters";

const now = Date.parse("2026-08-11T00:00:00.000Z");
const users: AdminUserSummary[] = [
  {
    id: 1,
    name: "Eliza Wood",
    email: "bethmarieshanley6@gmail.com",
    role: "admin",
    createdAt: "2026-08-01T00:00:00.000Z",
    lastSignedIn: "2026-08-10T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Pixel Fan",
    email: "pixel@example.com",
    role: "user",
    createdAt: "2026-07-01T00:00:00.000Z",
    lastSignedIn: "2026-06-01T00:00:00.000Z",
  },
];

describe("admin user filters", () => {
  it("recognizes recent and stale activity using a 30-day window", () => {
    expect(isAdminUserActive(users[0].lastSignedIn, now)).toBe(true);
    expect(isAdminUserActive(users[1].lastSignedIn, now)).toBe(false);
  });

  it("searches by name, email, and ID", () => {
    expect(filterAdminUsers(users, { query: "eliza", now })).toHaveLength(1);
    expect(filterAdminUsers(users, { query: "pixel@example.com", now })[0]?.id).toBe(2);
    expect(filterAdminUsers(users, { query: "1", now })[0]?.name).toBe("Eliza Wood");
  });

  it("combines role and activity filters", () => {
    expect(filterAdminUsers(users, { role: "admin", status: "active", now })).toEqual([users[0]]);
    expect(filterAdminUsers(users, { role: "user", status: "inactive", now })).toEqual([users[1]]);
    expect(filterAdminUsers(users, { role: "admin", status: "inactive", now })).toEqual([]);
  });

  it("returns an empty list when no users match", () => {
    expect(filterAdminUsers(users, { query: "missing", now })).toEqual([]);
  });

  it("resolves the exact selected users in selection order for a bulk preview", () => {
    expect(selectAdminUsers(users, [2, 999, 1])).toEqual([users[1], users[0]]);
  });
});
