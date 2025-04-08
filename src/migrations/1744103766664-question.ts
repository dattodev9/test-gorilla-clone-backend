import { MigrationInterface, QueryRunner } from "typeorm";

export class Question1744103766664 implements MigrationInterface {
    name = 'Question1744103766664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "one_choice_question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "content" character varying NOT NULL, "choices" jsonb NOT NULL DEFAULT '[]', "key" character varying NOT NULL, "time" integer NOT NULL, "order" integer NOT NULL, "test_id" uuid, CONSTRAINT "PK_371dc63072e3343f95508f0e87d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "multiple_choice_question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "content" character varying NOT NULL, "choices" jsonb NOT NULL DEFAULT '[]', "key" character varying array NOT NULL, "time" integer NOT NULL, "order" integer NOT NULL, "test_id" uuid, CONSTRAINT "PK_185ab845cbd133ecbb03c210044" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "test" ADD "status" character varying NOT NULL DEFAULT 'draft'`);
        await queryRunner.query(`ALTER TABLE "one_choice_question" ADD CONSTRAINT "FK_1bb41f24bb9be36b83bf47936ef" FOREIGN KEY ("test_id") REFERENCES "test"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "multiple_choice_question" ADD CONSTRAINT "FK_06d9262a66a74406ebd67c1a90b" FOREIGN KEY ("test_id") REFERENCES "test"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "multiple_choice_question" DROP CONSTRAINT "FK_06d9262a66a74406ebd67c1a90b"`);
        await queryRunner.query(`ALTER TABLE "one_choice_question" DROP CONSTRAINT "FK_1bb41f24bb9be36b83bf47936ef"`);
        await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TABLE "multiple_choice_question"`);
        await queryRunner.query(`DROP TABLE "one_choice_question"`);
    }

}
