import SQLiteESMFactory from "wa-sqlite/dist/wa-sqlite.mjs";
import * as SQLite from "wa-sqlite";
import { IDBBatchAtomicVFS } from "wa-sqlite/src/examples/IDBBatchAtomicVFS";
import {importDatabase,verify} from "./tools"
const SEARCH_PARAMS = new URLSearchParams(location.search);
const IDB_NAME = SEARCH_PARAMS.get("idb") ?? "sqlite-vfs";
const DB_NAME = SEARCH_PARAMS.get("db") ?? "sqlite";

interface IParameters {
  DBname: string;
}

export class SQLiteManage {
  DBname: string;
  private module: any;
  private sqlite3: SQLiteAPI;
  db: number;
  constructor(parameters: IParameters) {
    const { DBname } = parameters;
    this.DBname = DBname;
  }

  private async genModule() {
    const module = await SQLiteESMFactory();
    return module;
  }
  private genSqlite(module) {
    const sqlite3 = SQLite.Factory(module);
    return sqlite3;
  }
  async create() {

    const module = await this.genModule();
    const sqlite3 = this.genSqlite(module);
    const vfs = await IDBBatchAtomicVFS.create(this.DBname, module);
    const db = await sqlite3.open_v2(
      this.DBname||DB_NAME,
      // SQLite.SQLITE_OPEN_READWRITE,
      // IDB_NAME
    );
    sqlite3.vfs_register(vfs, true);

    this.module = module;
    this.sqlite3 = sqlite3;
    this.db = db;
  }

  async select() {
    await this.sqlite3.exec(
      this.db,
      `CREATE TABLE IF NOT EXISTS t(ID PRIMARY KEY,j INTEGER);
      INSERT OR REPLACE INTO t VALUES ('foo',121), ('bar',1);
      SELECT * FROM t;`,
      (row, columns) => {
        console.log({ row });
      }
    );
    await this.sqlite3.close(this.db);
  }
  async fileImport(event) {
    let vfs = await IDBBatchAtomicVFS.create(this.DBname, null);

    try {
      await importDatabase(vfs, this.DBname, event.target.files[0].stream());
      await verify();
    } catch (error) {
    } finally {
      vfs?.close();
    }
  }
}





