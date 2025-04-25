import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCandidateTrackingEntity1745554864809 implements MigrationInterface {
    name = 'UpdateCandidateTrackingEntity1745554864809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate_tracking" DROP COLUMN "webcam_captures_images"`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ADD "webcam_capture_images" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ALTER COLUMN "is_full_screen_exited" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ALTER COLUMN "is_dev_tools_opened" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ALTER COLUMN "tab_change_count" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ALTER COLUMN "tab_change_count" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ALTER COLUMN "is_dev_tools_opened" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ALTER COLUMN "is_full_screen_exited" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" DROP COLUMN "webcam_capture_images"`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ADD "webcam_captures_images" jsonb NOT NULL DEFAULT '[]'`);
    }

}
