const DATABASE_NAME = "anom-artsy-backgrounds";
const DATABASE_VERSION = 2;
const STORE_NAME = "backgrounds";
const ACTIVE_RECORD_ID = "active";

export type IndexedDbFactory = Pick<IDBFactory, "open">;

export type BackgroundImageRecord = {
  id: string;
  name: string;
  blob: Blob;
  createdAt: number;
};

type StoredBackgroundRecord = {
  id: string;
  kind?: "image" | "active";
  name?: string;
  blob?: Blob;
  createdAt?: number;
  selectedId?: string | null;
};

function getBrowserIndexedDb(): IndexedDbFactory | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    return window.indexedDB;
  } catch {
    return undefined;
  }
}

function createRecordId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `background-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeImageRecord(record: StoredBackgroundRecord | undefined): BackgroundImageRecord | null {
  if (!record || record.id === ACTIVE_RECORD_ID || !(record.blob instanceof Blob)) return null;

  return {
    id: record.id,
    name: record.name || "Custom background",
    blob: record.blob,
    createdAt: typeof record.createdAt === "number" ? record.createdAt : 0,
  };
}

function openDatabase(factory: IndexedDbFactory) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    let request: IDBOpenDBRequest;

    try {
      request = factory.open(DATABASE_NAME, DATABASE_VERSION);
    } catch (error) {
      reject(error);
      return;
    }

    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Unable to open background image storage"));
    request.onblocked = () => reject(new Error("Background image storage is blocked"));
  });
}

function closeDatabase(database: IDBDatabase) {
  try {
    database.close();
  } catch {
    // Closing is best effort; the browser owns the connection lifecycle.
  }
}

async function withDatabase<T>(factory: IndexedDbFactory | undefined, action: (database: IDBDatabase) => Promise<T>) {
  if (!factory) return null;

  let database: IDBDatabase | undefined;
  try {
    database = await openDatabase(factory);
    return await action(database);
  } catch {
    return null;
  } finally {
    if (database) closeDatabase(database);
  }
}

export async function listBackgroundImages(
  factory: IndexedDbFactory | undefined = getBrowserIndexedDb(),
): Promise<BackgroundImageRecord[]> {
  const result = await withDatabase(factory, (database) =>
    new Promise<BackgroundImageRecord[]>((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll();
      request.onerror = () => reject(request.error ?? new Error("Unable to list background images"));
      request.onsuccess = () => {
        const records = (request.result as StoredBackgroundRecord[])
          .map(normalizeImageRecord)
          .filter((record): record is BackgroundImageRecord => Boolean(record))
          .sort((a, b) => b.createdAt - a.createdAt);
        resolve(records);
      };
    }),
  );

  return result ?? [];
}

export async function saveBackgroundImageRecord(
  blob: Blob,
  name = "Custom background",
  factory: IndexedDbFactory | undefined = getBrowserIndexedDb(),
): Promise<BackgroundImageRecord | null> {
  const record: BackgroundImageRecord = {
    id: createRecordId(),
    name: name.trim() || "Custom background",
    blob,
    createdAt: Date.now(),
  };

  const saved = await withDatabase(factory, (database) =>
    new Promise<boolean>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      const request = transaction.objectStore(STORE_NAME).put({ ...record, kind: "image" } satisfies StoredBackgroundRecord);
      request.onerror = () => reject(request.error ?? new Error("Unable to save background image"));
      request.onsuccess = () => resolve(true);
      transaction.onerror = () => reject(transaction.error ?? new Error("Unable to save background image"));
      transaction.onabort = () => reject(transaction.error ?? new Error("Background image save was aborted"));
    }),
  );

  return saved ? record : null;
}

export async function getBackgroundImage(
  id: string,
  factory: IndexedDbFactory | undefined = getBrowserIndexedDb(),
): Promise<BackgroundImageRecord | null> {
  const result = await withDatabase(factory, (database) =>
    new Promise<BackgroundImageRecord | null>((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(id);
      request.onerror = () => reject(request.error ?? new Error("Unable to load background image"));
      request.onsuccess = () => resolve(normalizeImageRecord(request.result as StoredBackgroundRecord | undefined));
    }),
  );

  return result ?? null;
}

export async function getActiveBackgroundId(
  factory: IndexedDbFactory | undefined = getBrowserIndexedDb(),
): Promise<string | null> {
  const result = await withDatabase(factory, (database) =>
    new Promise<string | null>((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(ACTIVE_RECORD_ID);
      request.onerror = () => reject(request.error ?? new Error("Unable to load active background"));
      request.onsuccess = () => {
        const record = request.result as StoredBackgroundRecord | undefined;
        resolve(record?.id === ACTIVE_RECORD_ID ? record.selectedId ?? null : null);
      };
    }),
  );

  return result ?? null;
}

export async function setActiveBackgroundId(
  selectedId: string | null,
  factory: IndexedDbFactory | undefined = getBrowserIndexedDb(),
) {
  const result = await withDatabase(factory, (database) =>
    new Promise<boolean>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      const request = transaction.objectStore(STORE_NAME).put({
        id: ACTIVE_RECORD_ID,
        kind: "active",
        selectedId,
      } satisfies StoredBackgroundRecord);
      request.onerror = () => reject(request.error ?? new Error("Unable to set active background"));
      request.onsuccess = () => resolve(true);
      transaction.onerror = () => reject(transaction.error ?? new Error("Unable to set active background"));
      transaction.onabort = () => reject(transaction.error ?? new Error("Active background update was aborted"));
    }),
  );

  return result ?? false;
}

export async function deleteBackgroundImage(
  id: string,
  factory: IndexedDbFactory | undefined = getBrowserIndexedDb(),
) {
  const deleted = await withDatabase(factory, (database) =>
    new Promise<boolean>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      const request = transaction.objectStore(STORE_NAME).delete(id);
      request.onerror = () => reject(request.error ?? new Error("Unable to delete background image"));
      request.onsuccess = () => resolve(true);
      transaction.onerror = () => reject(transaction.error ?? new Error("Unable to delete background image"));
      transaction.onabort = () => reject(transaction.error ?? new Error("Background image deletion was aborted"));
    }),
  );

  if (!deleted) return false;
  if ((await getActiveBackgroundId(factory)) === id) await setActiveBackgroundId(null, factory);
  return true;
}

export async function deactivateBackgroundImage(
  factory: IndexedDbFactory | undefined = getBrowserIndexedDb(),
) {
  return setActiveBackgroundId(null, factory);
}

/** Backwards-compatible helper for the original single-image API. */
export async function saveBackgroundImage(
  blob: Blob,
  factory: IndexedDbFactory | undefined = getBrowserIndexedDb(),
) {
  const record = await saveBackgroundImageRecord(blob, "Custom background", factory);
  if (!record) return false;
  await setActiveBackgroundId(record.id, factory);
  return true;
}

/** Backwards-compatible helper that loads the selected image or the newest image. */
export async function loadBackgroundImage(
  factory: IndexedDbFactory | undefined = getBrowserIndexedDb(),
): Promise<Blob | null> {
  const records = await listBackgroundImages(factory);
  if (records.length === 0) return null;

  const activeId = await getActiveBackgroundId(factory);
  const selected = (activeId && records.find((record) => record.id === activeId)) || records[0];
  return selected?.blob ?? null;
}

/** Clears all image records for compatibility with existing callers and tests. */
export async function clearBackgroundImage(
  factory: IndexedDbFactory | undefined = getBrowserIndexedDb(),
) {
  const result = await withDatabase(factory, (database) =>
    new Promise<boolean>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      const request = transaction.objectStore(STORE_NAME).clear();
      request.onerror = () => reject(request.error ?? new Error("Unable to clear background images"));
      request.onsuccess = () => resolve(true);
      transaction.onerror = () => reject(transaction.error ?? new Error("Unable to clear background images"));
      transaction.onabort = () => reject(transaction.error ?? new Error("Background image clear was aborted"));
    }),
  );

  return result ?? false;
}
