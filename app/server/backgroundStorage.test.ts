import { describe, expect, it } from "vitest";
import {
  BACKGROUND_STORAGE_KEY,
  MAX_PERSISTED_BACKGROUND_LENGTH,
  persistBackground,
  persistBackgroundAppearance,
  readStoredBackground,
  readStoredBackgroundAppearance,
} from "../shared/backgroundStorage";

type Store = {
  value: string | null;
  setCalls: number;
  removeCalls: number;
  throwOnSet?: boolean;
};

function createStore(initial: string | null = null): Store & Storage {
  const store = {
    value: initial,
    setCalls: 0,
    removeCalls: 0,
    getItem() {
      return this.value;
    },
    setItem(_key: string, value: string) {
      this.setCalls += 1;
      if (this.throwOnSet) throw new DOMException("Quota exceeded", "QuotaExceededError");
      this.value = value;
    },
    removeItem() {
      this.removeCalls += 1;
      this.value = null;
    },
    clear() {},
    key() { return null; },
    length: 0,
  } as Store & Storage;
  return store;
}

describe("background storage", () => {
  it("clears oversized stored values instead of loading them", () => {
    const storage = createStore("x".repeat(MAX_PERSISTED_BACKGROUND_LENGTH + 1));

    expect(readStoredBackground(storage)).toBe("");
    expect(storage.removeCalls).toBe(1);
    expect(storage.value).toBeNull();
  });

  it("does not persist an oversized value", () => {
    const storage = createStore();

    expect(persistBackground("x".repeat(MAX_PERSISTED_BACKGROUND_LENGTH + 1), storage)).toBe(false);
    expect(storage.setCalls).toBe(0);
  });

  it("recovers from one quota failure by clearing stale data", () => {
    const storage = createStore("stale");
    let firstAttempt = true;
    const originalSetItem = storage.setItem.bind(storage);
    storage.setItem = (_key: string, value: string) => {
      if (firstAttempt) {
        firstAttempt = false;
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      }
      originalSetItem(BACKGROUND_STORAGE_KEY, value);
    };

    expect(persistBackground("linear-gradient(135deg, #ff00cc, #00eaff)", storage)).toBe(true);
    expect(storage.value).toContain("linear-gradient");
    expect(storage.removeCalls).toBe(1);
  });

  it("returns false when storage remains unavailable after cleanup", () => {
    const storage = createStore("stale");
    storage.throwOnSet = true;

    expect(persistBackground("linear-gradient(135deg, #ff00cc, #00eaff)", storage)).toBe(false);
    expect(storage.removeCalls).toBe(1);
  });

  it("persists and clamps custom background opacity and blur", () => {
    const storage = createStore();

    expect(persistBackgroundAppearance({ opacity: 2, blur: 30 }, storage)).toBe(true);
    expect(readStoredBackgroundAppearance(storage)).toEqual({ opacity: 1, blur: 16 });
  });

  it("uses safe defaults when appearance values are invalid", () => {
    const storage = createStore();
    storage.value = "not-a-number";

    expect(readStoredBackgroundAppearance(storage)).toEqual({ opacity: 0.15, blur: 0 });
  });
});
