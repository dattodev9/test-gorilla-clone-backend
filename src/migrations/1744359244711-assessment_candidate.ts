import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssessmentCandidate1744359244711 implements MigrationInterface {
  name = 'AssessmentCandidate1744359244711';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "candidate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "job_role" character varying NOT NULL, "test_link" character varying NOT NULL, "done_tests" jsonb NOT NULL DEFAULT '[]', "status" character varying NOT NULL DEFAULT 'draft', "take_date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "assessment_id" uuid, CONSTRAINT "PK_b0ddec158a9a60fbc785281581b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "assessment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "job_role" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'inactive', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c511a7dc128256876b6b1719401" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "assessment_tests_test" ("assessment_id" uuid NOT NULL, "test_id" uuid NOT NULL, CONSTRAINT "PK_8f69e63cb1e572660da5c1d005b" PRIMARY KEY ("assessment_id", "test_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e23fef33a8a3a6e67cfdb67361" ON "assessment_tests_test" ("assessment_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_610ed143e16dc227d42e661645" ON "assessment_tests_test" ("test_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "test_assessments_assessment" ("test_id" uuid NOT NULL, "assessment_id" uuid NOT NULL, CONSTRAINT "PK_8e7ba396b3f3f5c84a07aec76cb" PRIMARY KEY ("test_id", "assessment_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3239dde7fb5baf6d9aa03c3b2e" ON "test_assessments_assessment" ("test_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ce538692b275a8e8c520be0e54" ON "test_assessments_assessment" ("assessment_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "candidate" ADD CONSTRAINT "FK_18f30287d1ea3d2ad5a9751274c" FOREIGN KEY ("assessment_id") REFERENCES "assessment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment_tests_test" ADD CONSTRAINT "FK_e23fef33a8a3a6e67cfdb673619" FOREIGN KEY ("assessment_id") REFERENCES "assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment_tests_test" ADD CONSTRAINT "FK_610ed143e16dc227d42e6616456" FOREIGN KEY ("test_id") REFERENCES "test"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_assessments_assessment" ADD CONSTRAINT "FK_3239dde7fb5baf6d9aa03c3b2ea" FOREIGN KEY ("test_id") REFERENCES "test"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_assessments_assessment" ADD CONSTRAINT "FK_ce538692b275a8e8c520be0e545" FOREIGN KEY ("assessment_id") REFERENCES "assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test_assessments_assessment" DROP CONSTRAINT "FK_ce538692b275a8e8c520be0e545"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_assessments_assessment" DROP CONSTRAINT "FK_3239dde7fb5baf6d9aa03c3b2ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment_tests_test" DROP CONSTRAINT "FK_610ed143e16dc227d42e6616456"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment_tests_test" DROP CONSTRAINT "FK_e23fef33a8a3a6e67cfdb673619"`,
    );
    await queryRunner.query(
      `ALTER TABLE "candidate" DROP CONSTRAINT "FK_18f30287d1ea3d2ad5a9751274c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ce538692b275a8e8c520be0e54"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3239dde7fb5baf6d9aa03c3b2e"`,
    );
    await queryRunner.query(`DROP TABLE "test_assessments_assessment"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_610ed143e16dc227d42e661645"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e23fef33a8a3a6e67cfdb67361"`,
    );
    await queryRunner.query(`DROP TABLE "assessment_tests_test"`);
    await queryRunner.query(`DROP TABLE "assessment"`);
    await queryRunner.query(`DROP TABLE "candidate"`);
  }
}
