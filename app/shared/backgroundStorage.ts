export const BACKGROUND_STORAGE_KEY = "homepageBackground";
export const BACKGROUND_OPACITY_KEY = "homepageBackgroundOpacity";
export const BACKGROUND_BLUR_KEY = "homepageBackgroundBlur";
export const MAX_PERSISTED_BACKGROUND_LENGTH = 20_000;

export type BackgroundAppearance = {
  opacity: number;
  blur: number;
};

const DEFAULT_BACKGROUND_APPEARANCE: BackgroundAppearance = {
  opacity: 0.15,
  blur: 0,
};

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function getBrowserStorage(): StorageLike | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function readStoredBackground(storage: StorageLike | undefined = getBrowserStorage()) {
  if (!storage) return "";

  try {
    const stored = storage.getItem(BACKGROUND_STORAGE_KEY) || "";
    if (
      stored.length > MAX_PERSISTED_BACKGROUND_LENGTH ||
      (stored.length > 0 && !stored.startsWith("linear-gradient"))
    ) {
      storage.removeItem(BACKGROUND_STORAGE_KEY);
      return "";
    }
    return stored;
  } catch {
    return "";
  }
}

export function persistBackground(
  value: string,
  storage: StorageLike | undefined = getBrowserStorage(),
) {
  if (!storage || value.length > MAX_PERSISTED_BACKGROUND_LENGTH) return false;

  try {
    storage.setItem(BACKGROUND_STORAGE_KEY, value);
    return true;
  } catch {
    try {
      storage.removeItem(BACKGROUND_STORAGE_KEY);
      storage.setItem(BACKGROUND_STORAGE_KEY, value);
      return true;
    } catch {
      return false;
    }
  }
}

function readStoredNumber(key: string, fallback: number, min: number, max: number, storage: StorageLike | undefined) {
  if (!storage) return fallback;

  try {
    const parsed = Number(storage.getItem(key));
    return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
  } catch {
    return fallback;
  }
}

export function readStoredBackgroundAppearance(
  storage: StorageLike | undefined = getBrowserStorage(),
): BackgroundAppearance {
  return {
    opacity: readStoredNumber(BACKGROUND_OPACITY_KEY, DEFAULT_BACKGROUND_APPEARANCE.opacity, 0.1, 1, storage),
    blur: readStoredNumber(BACKGROUND_BLUR_KEY, DEFAULT_BACKGROUND_APPEARANCE.blur, 0, 16, storage),
  };
}

export function persistBackgroundAppearance(
  appearance: BackgroundAppearance,
  storage: StorageLike | undefined = getBrowserStorage(),
) {
  if (!storage) return false;

  try {
    storage.setItem(BACKGROUND_OPACITY_KEY, String(Math.min(1, Math.max(0.1, appearance.opacity))));
    storage.setItem(BACKGROUND_BLUR_KEY, String(Math.min(16, Math.max(0, appearance.blur))));
    return true;
  } catch {
    return false;
  }
}
