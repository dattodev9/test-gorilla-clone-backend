import { MigrationInterface, QueryRunner } from "typeorm";

export class OptinalQuestionContent1746609890459 implements MigrationInterface {
    name = 'OptinalQuestionContent1746609890459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "one_choice_question" ALTER COLUMN "content" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_question" ALTER COLUMN "content" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "coding_question" ALTER COLUMN "content" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coding_question" ALTER COLUMN "content" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_question" ALTER COLUMN "content" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "one_choice_question" ALTER COLUMN "content" SET NOT NULL`);
    }

}
