import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCandidateDoneTests1744456646435 implements MigrationInterface {
    name = 'UpdateCandidateDoneTests1744456646435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" ALTER COLUMN "done_tests" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" ALTER COLUMN "done_tests" SET NOT NULL`);
    }

}
