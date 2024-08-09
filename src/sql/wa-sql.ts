import SQLiteESMFactory from "wa-sqlite/dist/wa-sqlite.mjs";
import * as SQLite from "wa-sqlite";
import { IDBBatchAtomicVFS } from "wa-sqlite/src/examples/IDBBatchAtomicVFS";
export async function hello() {
  const module = await SQLiteESMFactory();
  const sqlite3 = SQLite.Factory(module);
  const vfs = await IDBBatchAtomicVFS.create("hello2222222222", module);
  const db = await sqlite3.open_v2("test");
  await sqlite3.exec(db, `SELECT 'Hello, world!'`, (row, columns) => {
  sqlite3.vfs_register(vfs, true);
    
    console.log({ row });
  });
  await sqlite3.close(db);
}
