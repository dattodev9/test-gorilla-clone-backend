import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Test } from '../../../../entities/test.entity';
import { Repository } from 'typeorm';
import { TestNotFoundError } from '../error/test-not-found.error';
import { TestResponse } from '../../get-test/command/get-test.command-handler';
import { AppDataSource } from 'src/shared/app-data-source';

Inject();

export class GetTestByIdCommandHandler {
  constructor(
    @InjectRepository(Test) private testRepository: Repository<Test>,
  ) {}

  public async execute(id: string) {
    const existTest = await this.findTestById(id);

    if (!existTest) {
      throw new TestNotFoundError();
    }

    return existTest;
  }

  async findTestById(id: string) {
    const query = `
        SELECT t.*,
               (SELECT COALESCE(SUM(ocq.time), 0)
                FROM one_choice_question ocq
                WHERE ocq.test_id = t.id) +
               (SELECT COALESCE(SUM(mcq.time), 0)
                FROM multiple_choice_question mcq
                WHERE mcq.test_id = t.id) +
               (SELECT COALESCE(SUM(cq.time), 0)
                FROM coding_question cq
                WHERE cq.test_id = t.id) AS "totalTime",
               (SELECT COUNT(*)
                FROM one_choice_question ocq
                WHERE ocq.test_id = t.id) +
               (SELECT COUNT(*)
                FROM multiple_choice_question mcq
                WHERE mcq.test_id = t.id) +
               (SELECT COUNT(*)
                FROM coding_question cq
                WHERE cq.test_id = t.id) AS "totalQuestion"
        FROM test t
        WHERE t.id = '${id}'
    `;

    const result: TestResponse[] = await AppDataSource.query(query);
    return result[0];
  }
}
