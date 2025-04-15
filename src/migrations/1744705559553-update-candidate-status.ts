import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCandidateStatus1744705559553 implements MigrationInterface {
    name = 'UpdateCandidateStatus1744705559553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" ALTER COLUMN "status" SET DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" ALTER COLUMN "status" SET DEFAULT 'draft'`);
    }

}
