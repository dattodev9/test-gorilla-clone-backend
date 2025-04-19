import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCandidate1745063274153 implements MigrationInterface {
    name = 'UpdateCandidate1745063274153'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" DROP COLUMN "assessment_time"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" ADD "assessment_time" integer`);
    }

}
