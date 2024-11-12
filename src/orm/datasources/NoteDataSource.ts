import { DataSource } from "typeorm";
import sqliteParams from "../sqliteParams";
import { NoteEntity } from "../entities/note/note";
import * as migrations from "../migrations/note";

export const DB_NAME = "buddyNotes";

export const dataSourceNote = new DataSource({
  name: "noteConnection",
  type: "capacitor",
  driver: sqliteParams.connection,
  mode: "no-encryption",
  database: DB_NAME,
  version: 1,
  entities: [NoteEntity],
  logging: ["query", "error", "schema"],
  migrations: migrations,
  subscribers: [],
  synchronize: false, // !!!You will lose all data in database if set to `true`
  migrationsRun: false,
});

const noteDataSource = {
  dataSource: dataSourceNote,
  dbName: DB_NAME,
};

export default noteDataSource;
