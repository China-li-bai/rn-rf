export class IndexedDB {
  constructor(private name) {
    this.name = name
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

        let objectStore = db.createObjectStore("contacts", {
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
  async persistContact(db,contact) {
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
  async  removeContact(db,key) {
    return new Promise<void>((resolve, reject) => {
        let transaction = db.transaction(['contacts'], 'readwrite');

        transaction.oncomplete = event => {
            resolve();
        };
        
        transaction.onerror = event => {
            reject(event);
        };
        
        let store = transaction.objectStore('contacts');
        store.delete(key);
        
    });
}
}
