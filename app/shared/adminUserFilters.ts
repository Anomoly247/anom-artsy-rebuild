export type AdminUserRole = "admin" | "user";
export type AdminUserAccountStatus = "active" | "suspended";
export type AdminUserRoleFilter = "all" | AdminUserRole;
export type AdminUserStatusFilter = "all" | "active" | "inactive";

export type AdminUserSummary = {
  id: number;
  name: string | null;
  email: string | null;
  role: AdminUserRole;
  status?: AdminUserAccountStatus;
  createdAt: Date | string;
  lastSignedIn: Date | string | null;
};

const ACTIVE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export function isAdminUserActive(lastSignedIn: Date | string | null, now = Date.now()): boolean {
  if (!lastSignedIn) return false;
  const signedInAt = new Date(lastSignedIn).getTime();
  return Number.isFinite(signedInAt) && now - signedInAt <= ACTIVE_WINDOW_MS;
}

export function filterAdminUsers(
  users: readonly AdminUserSummary[],
  options: {
    query?: string;
    role?: AdminUserRoleFilter;
    status?: AdminUserStatusFilter;
    now?: number;
  } = {},
): AdminUserSummary[] {
  const query = options.query?.trim().toLowerCase() ?? "";
  const role = options.role ?? "all";
  const status = options.status ?? "all";
  const now = options.now ?? Date.now();

  return users.filter((user) => {
    const searchableText = `${user.id} ${user.name ?? ""} ${user.email ?? ""}`.toLowerCase();
    const matchesQuery = query.length === 0 || searchableText.includes(query);
    const matchesRole = role === "all" || user.role === role;
    const active = isAdminUserActive(user.lastSignedIn, now);
    const matchesStatus = status === "all" || (status === "active" ? active : !active);
    return matchesQuery && matchesRole && matchesStatus;
  });
}

export function selectAdminUsers(
  users: readonly AdminUserSummary[],
  selectedIds: readonly number[],
): AdminUserSummary[] {
  const usersById = new Map(users.map((user) => [user.id, user]));
  return selectedIds
    .map((id) => usersById.get(id))
    .filter((user): user is AdminUserSummary => user !== undefined);
}
