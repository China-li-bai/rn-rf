import SQLiteESMFactory from "wa-sqlite/dist/wa-sqlite.mjs";
import * as SQLite from "wa-sqlite";
import { IDBBatchAtomicVFS } from "wa-sqlite/src/examples/IDBBatchAtomicVFS";
export async function helloWaSQL() {
  const module = await SQLiteESMFactory();
  const sqlite3 = SQLite.Factory(module);
  const vfs = await IDBBatchAtomicVFS.create("test-111", module);
  const db = await sqlite3.open_v2("test-222");
  sqlite3.vfs_register(vfs, true);

  // await sqlite3.exec(
  //   db,
  //   `SELECT * FROM t;`,
  //   (row, columns) => {
  //     console.log({ db, row, vfs });
  //   }
  // );
  await sqlite3.exec(db, `SELECT 'Hello, world121!'`, (row, columns) => {
    console.log(row);
  });
  await sqlite3.close(db);
}
