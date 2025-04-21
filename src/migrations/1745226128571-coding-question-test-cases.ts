import { MigrationInterface, QueryRunner } from "typeorm";

export class CodingQuestionTestCases1745226128571 implements MigrationInterface {
    name = 'CodingQuestionTestCases1745226128571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coding_question" RENAME COLUMN "choices" TO "test_cases"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coding_question" RENAME COLUMN "test_cases" TO "choices"`);
    }

}
