import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1731418623060 implements MigrationInterface {
  name = "Init1731418623060";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE "notes" (
            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
            "title" varchar NOT NULL,
            "content" text NOT NULL
          )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "notes"`);
  }
}
