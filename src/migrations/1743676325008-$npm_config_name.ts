import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1743676325008 implements MigrationInterface {
    name = ' $npmConfigName1743676325008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "is_first_time_login" TO "is_first_time_change_password"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "is_first_time_change_password" TO "is_first_time_login"`);
    }

}
