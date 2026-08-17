const IDENTITY_KEYS = [
  "openId",
  "openID",
  "open_id",
  "id",
  "sub",
  "identifier",
  "userId",
  "user_id",
] as const;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === "object" ? value as UnknownRecord : null;
}

function firstString(record: UnknownRecord): string | undefined {
  for (const key of IDENTITY_KEYS) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

/**
 * Normalizes identifiers returned by OAuth providers and proxy layers.
 * Providers may return the identifier at the top level or inside a profile,
 * user, data, result, account, or claims object.
 */
export function normalizeUserOpenId(value: unknown, depth = 0): string | undefined {
  const root = asRecord(value);
  if (!root) return undefined;

  const direct = firstString(root);
  if (direct) return direct;
  if (depth >= 2) return undefined;

  for (const key of ["profile", "user", "data", "result", "account", "claims"]) {
    const candidate = normalizeUserOpenId(root[key], depth + 1);
    if (candidate) return candidate;
  }

  return undefined;
}
