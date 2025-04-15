import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStatus1744703915701 implements MigrationInterface {
    name = 'UpdateStatus1744703915701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assessment" ALTER COLUMN "status" SET DEFAULT 'draft'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assessment" ALTER COLUMN "status" SET DEFAULT 'inactive'`);
    }

}
