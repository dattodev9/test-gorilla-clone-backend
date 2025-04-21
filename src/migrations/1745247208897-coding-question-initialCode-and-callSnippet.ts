import { MigrationInterface, QueryRunner } from "typeorm";

export class CodingQuestionInitialCodeAndCallSnippet1745247208897 implements MigrationInterface {
    name = 'CodingQuestionInitialCodeAndCallSnippet1745247208897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coding_question" DROP COLUMN "starter_code"`);
        await queryRunner.query(`ALTER TABLE "coding_question" ADD "initial_code" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "coding_question" ADD "call_snippet" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coding_question" DROP COLUMN "call_snippet"`);
        await queryRunner.query(`ALTER TABLE "coding_question" DROP COLUMN "initial_code"`);
        await queryRunner.query(`ALTER TABLE "coding_question" ADD "starter_code" text`);
    }

}
