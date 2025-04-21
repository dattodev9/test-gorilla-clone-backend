import { MigrationInterface, QueryRunner } from "typeorm";

export class CodingQuestion1745225991577 implements MigrationInterface {
    name = 'CodingQuestion1745225991577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "coding_question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "content" character varying NOT NULL, "choices" jsonb NOT NULL DEFAULT '[]', "time" integer NOT NULL, "order" integer NOT NULL, "test_id" uuid, CONSTRAINT "PK_cd03b19ba505906da34c7da14fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "coding_question" ADD CONSTRAINT "FK_cce703b6d0fc770d266fae3d178" FOREIGN KEY ("test_id") REFERENCES "test"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coding_question" DROP CONSTRAINT "FK_cce703b6d0fc770d266fae3d178"`);
        await queryRunner.query(`DROP TABLE "coding_question"`);
    }

}
