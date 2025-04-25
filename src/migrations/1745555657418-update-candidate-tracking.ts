import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCandidateTracking1745555657418 implements MigrationInterface {
    name = 'UpdateCandidateTracking1745555657418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ALTER COLUMN "is_full_screen_exited" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ALTER COLUMN "is_full_screen_exited" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ALTER COLUMN "is_dev_tools_opened" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ALTER COLUMN "is_dev_tools_opened" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ALTER COLUMN "tab_change_count" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ALTER COLUMN "tab_change_count" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ALTER COLUMN "tab_change_count" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ALTER COLUMN "tab_change_count" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ALTER COLUMN "is_dev_tools_opened" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ALTER COLUMN "is_dev_tools_opened" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ALTER COLUMN "is_full_screen_exited" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "candidate_tracking" ALTER COLUMN "is_full_screen_exited" DROP NOT NULL`);
    }

}
