import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCandidateDeleteTestlink1744543597620 implements MigrationInterface {
    name = 'UpdateCandidateDeleteTestlink1744543597620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" DROP COLUMN "test_link"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" ADD "test_link" character varying`);
    }

}
