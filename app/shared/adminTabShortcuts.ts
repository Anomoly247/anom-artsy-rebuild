export const ADMIN_TAB_IDS = ['dashboard', 'users', 'audit', 'events', 'settings', 'features'] as const;

export type AdminTabId = (typeof ADMIN_TAB_IDS)[number];

type ShortcutKeyboardEvent = Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey' | 'key'>;

export function resolveAdminTabShortcut(event: ShortcutKeyboardEvent): AdminTabId | undefined {
  if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return undefined;
  const index = Number(event.key) - 1;
  return index >= 0 && index < ADMIN_TAB_IDS.length ? ADMIN_TAB_IDS[index] : undefined;
}
