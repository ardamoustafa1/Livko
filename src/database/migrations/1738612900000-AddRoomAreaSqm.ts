import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoomAreaSqm1738612900000 implements MigrationInterface {
  name = 'AddRoomAreaSqm1738612900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rooms" ADD "area_sqm" float`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "area_sqm"`);
  }
}
