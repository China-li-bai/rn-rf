export function promisifyRequest<T = undefined>(
  request: IDBRequest<T> | IDBTransaction
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    // @ts-ignore - file size hacks
    request.oncomplete = request.onsuccess = () => resolve(request.result);
    // @ts-ignore - file size hacks
    request.onabort = request.onerror = () => reject(request.error);
  });
}

export function getSingle<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let result: ReturnType<T> | undefined;
  return function (...args: Parameters<T>): ReturnType<T> | undefined {
    if (!result) {
      result = fn.apply(this, args);
    }
    return result;
  };
}
export type UseStore = <T>(
  txMode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => T | PromiseLike<T>
) => Promise<T>;

export function createStore(dbName: string, storeName: string): UseStore {
  const request = indexedDB.open(dbName);
  request.onupgradeneeded = () => request.result.createObjectStore(storeName);
  const dbp = promisifyRequest(request);

  return (txMode, callback) =>
    dbp.then((db) =>
      callback(db.transaction(storeName, txMode).objectStore(storeName))
    );
}

let defaultGetStoreFunc: UseStore | undefined;

function defaultGetStore() {
  if (!defaultGetStoreFunc) {
    defaultGetStoreFunc = createStore("keyval-store", "keyval");
  }
  return defaultGetStoreFunc;
}
/**
 * Get a value by its key.
 *
 * @param key
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
export function get<T = any>(
  key: IDBValidKey,
  customStore = defaultGetStore()
): Promise<T | undefined> {
  return customStore("readonly", (store) => promisifyRequest(store.get(key)));
}

/**
 * Set a value with a key.
 *
 * @param key
 * @param value
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
export function set(
  key: IDBValidKey,
  value: any,
  customStore = defaultGetStore()
): Promise<void> {
  return customStore("readwrite", (store) => {
    store.put(value, key);
    return promisifyRequest(store.transaction);
  });
}

export function createIndex(
  index: string,
  unique: boolean = false,
  customStore = defaultGetStore()
) {

  return customStore("readonly",(store)=>{
    store.createIndex(index, index, { unique });
  })
}
