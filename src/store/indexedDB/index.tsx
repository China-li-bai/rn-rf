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

interface IParams {
  dbName: string;
  storeName: string;
}

export function proxyReject() {
  return Promise.reject();
}

export class IndexedDB {
  db: IDBDatabase;
  constructor(private dbName: string, params?: IParams) {
    this.dbName = dbName;
  }
  async getDB() {
    const request: IDBOpenDBRequest = indexedDB.open(this.dbName);
    console.log({ readyState: request.readyState }, request);
    request.onsuccess = (ev) => {
      console.log(
        "onsuccess",
        { readyState: request.readyState },
        request.result,
        (ev.target as IDBOpenDBRequest).result
      );
      return Promise.resolve(request.result);
    };
    console.log({ readyState: request.readyState }, this.db);
  }

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.name);
      request.onerror = (event) => {
        console.error(event);
      };
      request.onupgradeneeded = (event) => {
        console.log("idb onupgradeneeded firing");
        let db = event.target.result;

        let objectStore = db.createObjectStore("contacts222", {
          keyPath: "id",
          autoIncrement: true,
        });
        objectStore.createIndex("lastname", "lastname", { unique: false });
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  }
  async getContacts(db) {
    return new Promise((resolve, reject) => {
      let transaction = db.transaction(["contacts"], "readonly");

      transaction.onerror = (event) => {
        reject(event);
      };

      let store = transaction.objectStore("contacts");
      store.getAll().onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  }
  async getContact(db, key) {
    return new Promise((resolve, reject) => {
      let transaction = db.transaction(["contacts"], "readonly");

      transaction.onerror = (event) => {
        reject(event);
      };

      let store = transaction.objectStore("contacts");
      store.get(key).onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  }
  async persistContact(db, contact) {
    return new Promise<void>((resolve, reject) => {
      let transaction = db.transaction(["contacts"], "readwrite");
      transaction.oncomplete = (event) => {
        resolve();
      };

      transaction.onerror = (event) => {
        reject(event);
      };

      let store = transaction.objectStore("contacts");
      store.put(contact);
    });
  }
  async removeContact(db, key) {
    return new Promise<void>((resolve, reject) => {
      let transaction = db.transaction(["contacts"], "readwrite");

      transaction.oncomplete = (event) => {
        resolve();
      };

      transaction.onerror = (event) => {
        reject(event);
      };

      let store = transaction.objectStore("contacts");
      store.delete(key);
    });
  }
}
