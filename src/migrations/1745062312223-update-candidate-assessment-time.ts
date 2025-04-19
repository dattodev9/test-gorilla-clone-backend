import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCandidateAssessmentTime1745062312223 implements MigrationInterface {
    name = 'UpdateCandidateAssessmentTime1745062312223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" ADD "assessment_time" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" DROP COLUMN "assessment_time"`);
    }

}
