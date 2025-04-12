import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCandidate1744454636775 implements MigrationInterface {
    name = 'UpdateCandidate1744454636775'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" DROP COLUMN "job_role"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" ADD "job_role" character varying NOT NULL`);
    }

}
