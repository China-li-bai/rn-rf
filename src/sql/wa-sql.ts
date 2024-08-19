import SQLiteESMFactory from "wa-sqlite/dist/wa-sqlite.mjs";
import * as SQLite from "wa-sqlite";
import { IDBBatchAtomicVFS } from "wa-sqlite/src/examples/IDBBatchAtomicVFS";
export async function hello() {
  const module = await SQLiteESMFactory();
  const sqlite3 = SQLite.Factory(module);
  const vfs = await IDBBatchAtomicVFS.create("hello2222222222", module);
  const db = await sqlite3.open_v2("test");
  sqlite3.vfs_register(vfs, true);

  await sqlite3.exec(db, `CREATE TABLE IF NOT EXISTS t(ID PRIMARY KEY,j INTEGER);
INSERT OR REPLACE INTO t VALUES ('foo',121), ('bar',1);
SELECT * FROM t;`, (row, columns) => {
    
    console.log({db, row,vfs });
  });
  await sqlite3.exec(db, ``,()=>{
    
  })
  await sqlite3.close(db);
}
