import { MigrationInterface, QueryRunner } from "typeorm";

export class CodingQuestionStarterCode1745243636055 implements MigrationInterface {
    name = 'CodingQuestionStarterCode1745243636055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coding_question" ADD "starter_code" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coding_question" DROP COLUMN "starter_code"`);
    }

}
