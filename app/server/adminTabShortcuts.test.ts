import { describe, expect, it } from "vitest";
import { ADMIN_TAB_IDS, resolveAdminTabShortcut } from "../shared/adminTabShortcuts";

describe("admin tab shortcuts", () => {
  it("maps Alt+1 through Alt+6 to the six control-panel tabs", () => {
    expect(ADMIN_TAB_IDS.map((_, index) => resolveAdminTabShortcut({ altKey: true, ctrlKey: false, metaKey: false, shiftKey: false, key: String(index + 1) }))).toEqual([...ADMIN_TAB_IDS]);
  });

  it("ignores modified shortcuts and non-tab keys", () => {
    expect(resolveAdminTabShortcut({ altKey: false, ctrlKey: false, metaKey: false, shiftKey: false, key: "1" })).toBeUndefined();
    expect(resolveAdminTabShortcut({ altKey: true, ctrlKey: true, metaKey: false, shiftKey: false, key: "1" })).toBeUndefined();
    expect(resolveAdminTabShortcut({ altKey: true, ctrlKey: false, metaKey: false, shiftKey: false, key: "7" })).toBeUndefined();
  });
});
