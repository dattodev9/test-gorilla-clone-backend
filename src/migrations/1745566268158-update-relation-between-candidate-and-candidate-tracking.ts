import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRelationBetweenCandidateAndCandidateTracking1745566268158 implements MigrationInterface {
    name = 'UpdateRelationBetweenCandidateAndCandidateTracking1745566268158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ADD "candidate_id" uuid`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ADD CONSTRAINT "UQ_fcc792a72328f6515fed13afa00" UNIQUE ("candidate_id")`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ADD CONSTRAINT "FK_fcc792a72328f6515fed13afa00" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate_tracking" DROP CONSTRAINT "FK_fcc792a72328f6515fed13afa00"`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" DROP CONSTRAINT "UQ_fcc792a72328f6515fed13afa00"`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" DROP COLUMN "candidate_id"`);
    }

}
