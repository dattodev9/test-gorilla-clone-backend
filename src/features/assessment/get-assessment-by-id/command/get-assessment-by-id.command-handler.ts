import { Inject } from '@nestjs/common';
import { Assessment } from 'src/entities/assessment.entity';
import { AppDataSource } from 'src/shared/app-data-source';

type AssessmentResponse = Pick<
  Assessment,
  'name' | 'jobRole' | 'status' | 'candidates' | 'tests'
> & {
  testsCount: string;
  testsTime: string;
};

Inject();

export class GetAssessmentByIdCommandHandler {
  constructor() {}

  public async execute(id: string) {
    return await this.findById(id);
  }

  private async findById(id: string) {
    const query = `
        SELECT a.name,
               a.job_role     AS "jobRole",
               a.status,
               COUNT(t.id)    AS "testsCount",
               COALESCE(SUM(
                                (SELECT COALESCE(SUM(ocq.time), 0)
                                 FROM one_choice_question ocq
                                 WHERE ocq.test_id = t.id) +
                                (SELECT COALESCE(SUM(mcq.time), 0)
                                 FROM multiple_choice_question mcq
                                 WHERE mcq.test_id = t.id) +
                                (SELECT COALESCE(SUM(cq.time), 0)
                                 FROM coding_question cq
                                 WHERE cq.test_id = t.id)
                        ), 0) AS "testsTime",
               COALESCE(
                               JSON_AGG(
                               JSON_BUILD_OBJECT(
                                       'id', t.id,
                                       'name', t.name,
                                       'duration', (SELECT COALESCE(SUM(ocq.time), 0)
                                                    FROM one_choice_question ocq
                                                    WHERE ocq.test_id = t.id) +
                                                   (SELECT COALESCE(SUM(mcq.time), 0)
                                                    FROM multiple_choice_question mcq
                                                    WHERE mcq.test_id = t.id) +
                                                   (SELECT COALESCE(SUM(cq.time), 0)
                                                    FROM coding_question cq
                                                    WHERE cq.test_id = t.id)
                               )
                                       ) FILTER (WHERE t.id IS NOT NULL), '[]'
               )              AS "tests"
        FROM assessment a
                 LEFT JOIN assessment_tests_test at ON a.id = at.assessment_id
                 LEFT JOIN test t ON at.test_id = t.id
        WHERE a.id = '${id}'
        GROUP BY a.id;
    `;

    const result: AssessmentResponse[] = await AppDataSource.query(query);
    return result[0];
  }
}
