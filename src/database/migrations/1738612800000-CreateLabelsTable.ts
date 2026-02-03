import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLabelsTable1738612800000 implements MigrationInterface {
  name = 'CreateLabelsTable1738612800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
      CREATE TABLE "labels" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "institution_id" uuid NOT NULL,
        "entity_type" character varying(32) NOT NULL,
        "entity_id" uuid NOT NULL,
        "locale" character varying(16) NOT NULL,
        "key" character varying(64) NOT NULL,
        "value" text NOT NULL,
        CONSTRAINT "PK_labels" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_labels_institution_id" ON "labels" ("institution_id")`);
    await queryRunner.query(
      `CREATE INDEX "idx_labels_entity" ON "labels" ("institution_id", "entity_type", "entity_id", "locale")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_labels_entity"`);
    await queryRunner.query(`DROP INDEX "idx_labels_institution_id"`);
    await queryRunner.query(`DROP TABLE "labels"`);
  }
}
