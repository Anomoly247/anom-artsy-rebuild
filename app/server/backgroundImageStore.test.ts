import { describe, expect, it } from "vitest";
import FDBFactory from "fake-indexeddb/lib/FDBFactory";
import {
  clearBackgroundImage,
  deleteBackgroundImage,
  getActiveBackgroundId,
  listBackgroundImages,
  loadBackgroundImage,
  saveBackgroundImage,
  saveBackgroundImageRecord,
  setActiveBackgroundId,
} from "../shared/backgroundImageStore";

function createFactory() {
  return new FDBFactory();
}

describe("background image IndexedDB repository", () => {
  it("persists, hydrates, and clears a custom image Blob", async () => {
    const factory = createFactory();
    const original = new Blob(["pixel-data"], { type: "image/png" });

    expect(await saveBackgroundImage(original, factory)).toBe(true);
    const loaded = await loadBackgroundImage(factory);

    expect(loaded).not.toBeNull();
    expect(loaded?.type).toBe("image/png");
    expect(await loaded?.text()).toBe("pixel-data");
    expect(await clearBackgroundImage(factory)).toBe(true);
    expect(await loadBackgroundImage(factory)).toBeNull();
  });

  it("supports multiple gallery records and active selection", async () => {
    const factory = createFactory();
    const first = await saveBackgroundImageRecord(new Blob(["first"]), "First background", factory);
    const second = await saveBackgroundImageRecord(new Blob(["second"]), "Second background", factory);

    expect(first?.name).toBe("First background");
    expect(second?.name).toBe("Second background");
    expect(await listBackgroundImages(factory)).toHaveLength(2);

    expect(first).not.toBeNull();
    await setActiveBackgroundId(first!.id, factory);
    expect(await getActiveBackgroundId(factory)).toBe(first!.id);
    expect(await (await loadBackgroundImage(factory))?.text()).toBe("first");

    expect(second).not.toBeNull();
    await setActiveBackgroundId(second!.id, factory);
    expect(await (await loadBackgroundImage(factory))?.text()).toBe("second");
  });

  it("deletes a gallery record and clears the active selection when needed", async () => {
    const factory = createFactory();
    const record = await saveBackgroundImageRecord(new Blob(["remove-me"]), "Remove me", factory);

    expect(record).not.toBeNull();
    await setActiveBackgroundId(record!.id, factory);
    expect(await deleteBackgroundImage(record!.id, factory)).toBe(true);
    expect(await getActiveBackgroundId(factory)).toBeNull();
    expect(await listBackgroundImages(factory)).toHaveLength(0);
  });

  it("returns safe fallbacks when IndexedDB is unavailable", async () => {
    const image = new Blob(["pixel-data"], { type: "image/png" });

    expect(await saveBackgroundImage(image, undefined)).toBe(false);
    expect(await saveBackgroundImageRecord(image, "Unavailable", undefined)).toBeNull();
    expect(await loadBackgroundImage(undefined)).toBeNull();
    expect(await listBackgroundImages(undefined)).toEqual([]);
    expect(await clearBackgroundImage(undefined)).toBe(false);
  });
});
