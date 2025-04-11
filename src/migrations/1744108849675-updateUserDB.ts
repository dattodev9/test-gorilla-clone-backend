import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserDB1744108849675 implements MigrationInterface {
  name = 'UpdateUserDB1744108849675';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "question_count"`);
    await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "duration"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test" ADD "duration" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" ADD "question_count" integer NOT NULL DEFAULT '0'`,
    );
  }
}
