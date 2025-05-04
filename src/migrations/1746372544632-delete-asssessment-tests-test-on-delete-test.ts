import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteAsssessmentTestsTestOnDeleteTest1746372544632 implements MigrationInterface {
    name = 'DeleteAsssessmentTestsTestOnDeleteTest1746372544632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate_tracking" DROP CONSTRAINT "FK_fcc792a72328f6515fed13afa00"`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ADD CONSTRAINT "FK_fcc792a72328f6515fed13afa00" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate_tracking" DROP CONSTRAINT "FK_fcc792a72328f6515fed13afa00"`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ADD CONSTRAINT "FK_fcc792a72328f6515fed13afa00" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
