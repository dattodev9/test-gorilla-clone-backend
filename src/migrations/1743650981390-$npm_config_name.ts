import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1743650981390 implements MigrationInterface {
    name = ' $npmConfigName1743650981390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "is_first_time_login" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "is_first_time_login" SET DEFAULT false`);
    }

}
