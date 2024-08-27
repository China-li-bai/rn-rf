

interface IParams {
  dbName: string;
  storeName: string;
}

export function proxyReject() {
  return Promise.reject();
}
// 正确实现
export class Context {
  private static instanceMap: Record<string, Context> = {};
  static instance: any;
  public static getInstance(name: string) {
    if (!this.instanceMap[name]) {
      this.instanceMap[name] = new Context(name);
    }
    return this.instance;
  }
  name: string;

  private constructor(name: string) {
    this.name = name;
  }
}
//! 一个需要指定时间后返回的异步函数
function delay(timeout) {
  return new Promise((resolve) => setTimeout(() => resolve("end"), timeout));
}
class Test {
  end: unknown;
  then: any;
  constructor() {
    const init = (async () => {
      this.end = await delay(3000);
      delete this.then;
      return this;
    })();
    this.then = init.then.bind(init);
    console.log(init);
  }
}
// (async function () {
//     const test = await new Test();
//     console.log(test.end); // end
// })();
// const objectStoreMap : Map<string, IDBObjectStore> = new Map()



const objectStoreMap:Record<string, IDBObjectStore> = {}
export class IndexedDBClient {
  db: IDBDatabase;
  dbName: string;

  constructor(dbName: string) {
    this.dbName = dbName;
    this.asyncInit();
  }
  asyncInit() {
    (async () => {
      if (!this.db) {
        this.db = await this.createDB();
      
      }
      
    })();
  }
  async createDB() {
    const request: IDBOpenDBRequest = indexedDB.open(this.dbName);
    return new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  get(key) {
    this.db
      .transaction([this.dbName], "readwrite")
      .objectStore(this.dbName)
      .get(key);
  }
  // set(key,value){
  //   const customerObjectStore = this.db
  //   .transaction(, "readwrite")
  //   .objectStore();
  // }

  createStore(storeName: string) {
    const request: IDBOpenDBRequest = indexedDB.open(this.dbName);
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      const store = db.createObjectStore(storeName);
      console.log({store});
      
      objectStoreMap[storeName] = store
    };
    request.onerror=(err)=>{
      console.log({err});
      
    }
  }
  getStore(storeName:keyof typeof objectStoreMap){
    return objectStoreMap[storeName]
  }
  // async init() {
  //   return new Promise<void>((resolve, reject) => {
  //     const request = indexedDB.open(this.name);
  //     request.onerror = (event) => {
  //       console.error(event);
  //     };
  //     request.onupgradeneeded = (event) => {
  //       console.log("idb onupgradeneeded firing");
  //       let db = event.target.result;

  //       let objectStore = db.createObjectStore("contacts222", {
  //         keyPath: "id",
  //         autoIncrement: true,
  //       });
  //       objectStore.createIndex("lastname", "lastname", { unique: false });
  //     };

  //     request.onsuccess = (event) => {
  //       resolve(event.target.result);
  //     };
  //   });
  // }
  // async getContacts(db) {
  //   return new Promise((resolve, reject) => {
  //     let transaction = db.transaction(["contacts"], "readonly");

  //     transaction.onerror = (event) => {
  //       reject(event);
  //     };

  //     let store = transaction.objectStore("contacts");
  //     store.getAll().onsuccess = (event) => {
  //       resolve(event.target.result);
  //     };
  //   });
  // }
  // async getContact(db, key) {
  //   return new Promise((resolve, reject) => {
  //     let transaction = db.transaction(["contacts"], "readonly");

  //     transaction.onerror = (event) => {
  //       reject(event);
  //     };

  //     let store = transaction.objectStore("contacts");
  //     store.get(key).onsuccess = (event) => {
  //       resolve(event.target.result);
  //     };
  //   });
  // }
  // async persistContact(db, contact) {
  //   return new Promise<void>((resolve, reject) => {
  //     let transaction = db.transaction(["contacts"], "readwrite");
  //     transaction.oncomplete = (event) => {
  //       resolve();
  //     };

  //     transaction.onerror = (event) => {
  //       reject(event);
  //     };

  //     let store = transaction.objectStore("contacts");
  //     store.put(contact);
  //   });
  // }
  // async removeContact(db, key) {
  //   return new Promise<void>((resolve, reject) => {
  //     let transaction = db.transaction(["contacts"], "readwrite");

  //     transaction.oncomplete = (event) => {
  //       resolve();
  //     };

  //     transaction.onerror = (event) => {
  //       reject(event);
  //     };

  //     let store = transaction.objectStore("contacts");
  //     store.delete(key);
  //   });
  // }
}

// 当试图打开一个尚未被创建的数据库，或者试图连接一个数据库还没被创立的版本时，onupgradeneeded 事件会被触发

DBOpenRequest.onupgradeneeded = function (event) {
  var db = event.target.result;

  db.onerror = function (event) {
   
  };

  // 使用 IDBDatabase.createObjectStore 方法，可创建一个对象存储区

  var objectStore = db.createObjectStore("toDoList", { keyPath: "taskTitle" });

  // 定义 objectStore 将包含哪些数据项

  objectStore.createIndex("hours", "hours", { unique: false });
  objectStore.createIndex("minutes", "minutes", { unique: false });
  objectStore.createIndex("day", "day", { unique: false });
  objectStore.createIndex("month", "month", { unique: false });
  objectStore.createIndex("year", "year", { unique: false });

  objectStore.createIndex("notified", "notified", { unique: false });

  note.innerHTML += "<li>Object store created.</li>";
};

