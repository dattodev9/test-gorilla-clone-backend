import { MigrationInterface, QueryRunner } from 'typeorm';

export class IsExitedCandidateTracking1746725965228
  implements MigrationInterface
{
  name = 'IsExitedCandidateTracking1746725965228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "candidate_tracking"
        ADD "is_exited_during_assessment" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "candidate_tracking"
        DROP COLUMN "is_exited_during_assessment"`);
  }
}
