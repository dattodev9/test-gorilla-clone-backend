import { MigrationInterface, QueryRunner } from 'typeorm';

export class CandidateTrackingEntity1745553710876
  implements MigrationInterface
{
  name = 'CandidateTrackingEntity1745553710876';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "candidate_tracking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_full_screen_exited" boolean NOT NULL, "is_dev_tools_opened" boolean NOT NULL, "tab_change_count" integer NOT NULL, "screen_capture_images" jsonb NOT NULL DEFAULT '[]', "webcam_captures_images" jsonb NOT NULL DEFAULT '[]', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "candidate_id" uuid, CONSTRAINT "PK_6503266ea5646251e2896b19521" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "candidate_tracking" ADD CONSTRAINT "FK_fcc792a72328f6515fed13afa00" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "candidate_tracking" DROP CONSTRAINT "FK_fcc792a72328f6515fed13afa00"`,
    );
    await queryRunner.query(`DROP TABLE "candidate_tracking"`);
  }
}
