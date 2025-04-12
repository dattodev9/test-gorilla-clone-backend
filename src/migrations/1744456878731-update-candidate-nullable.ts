import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCandidateNullable1744456878731 implements MigrationInterface {
    name = 'UpdateCandidateNullable1744456878731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" ALTER COLUMN "test_link" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidate" ALTER COLUMN "done_tests" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidate" ALTER COLUMN "take_date" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER ∑TABLE "candidate" ALTER COLUMN "take_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidate" ALTER COLUMN "done_tests" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidate" ALTER COLUMN "test_link" SET NOT NULL`);
    }

}
