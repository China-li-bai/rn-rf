import * as VFS from "wa-sqlite/src/VFS.js";
import SQLiteESMFactory from "wa-sqlite/dist/wa-sqlite.mjs";
import * as SQLite from "wa-sqlite";
import { IDBBatchAtomicVFS } from "wa-sqlite/src/examples/IDBBatchAtomicVFS";

const SEARCH_PARAMS = new URLSearchParams(location.search);
const IDB_NAME = SEARCH_PARAMS.get("idb") ?? "sqlite-vfs";
const DB_NAME = SEARCH_PARAMS.get("db") ?? "sqlite.db";

(async function () {
  const module = await SQLiteESMFactory();
  const sqlite3 = SQLite.Factory(module);

  const vfs = await IDBBatchAtomicVFS.create(IDB_NAME, module);
  // @ts-ignore
  sqlite3.vfs_register(vfs, true);

  const db = await sqlite3.open_v2(
    DB_NAME,
    SQLite.SQLITE_OPEN_READWRITE,
    IDB_NAME
  );

  const results = [];
  await sqlite3.exec(db, "PRAGMA integrity_check;", (row, columns) => {
    results.push(row[0]);
  });
  console.log({db});
  await sqlite3.close(db);


  postMessage(results);
})();
