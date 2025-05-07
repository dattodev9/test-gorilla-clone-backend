import { Inject } from '@nestjs/common';
import { AppDataSource } from '../../../../shared/app-data-source';
import {
  Candidate,
  CandidateStatus,
} from '../../../../entities/candidate.entity';
import {
  Assessment,
  AssessmentStatus,
} from '../../../../entities/assessment.entity';
import { Test } from '../../../../entities/test.entity';

type TestAssessmentOverviewById = Pick<Test, 'name'> & {
  totalQuestions: string;
  totalTime: string;
};

export type AssessmentOverviewById = Pick<Candidate, 'name' | 'email'> &
  Pick<Assessment, 'jobRole'> & {
    tests: TestAssessmentOverviewById[];
  };

Inject();

export class GetAssessmentOverviewByIdCommandHandler {
  constructor() {}

  public async execute(id: string) {
    return await this.getCandidateAndAssessmentById(id);
  }

  private async getCandidateAndAssessmentById(
    id: string,
  ): Promise<AssessmentOverviewById> {
    const query = `
        SELECT c.name     AS "candidateName",
               c.email    AS "candidateEmail",
               a.job_role AS "jobRole",
               COALESCE(
                               JSON_AGG(
                               JSON_BUILD_OBJECT(
                                       'name', t.name,
                                       'totalQuestions',
                                       (SELECT COUNT(*)
                                        FROM one_choice_question ocq
                                        WHERE ocq.test_id = t.id) +
                                       (SELECT COUNT(*)
                                        FROM multiple_choice_question mcq
                                        WHERE mcq.test_id = t.id) +
                                       (SELECT COUNT(*)
                                        FROM coding_question cq
                                        WHERE cq.test_id = t.id),
                                       'totalTime',
                                       (SELECT COALESCE(SUM(ocq.time), 0)
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
               )          AS "tests"
        FROM candidate c
                 LEFT JOIN
             assessment a ON c.assessment_id = a.id
                 LEFT JOIN
             assessment_tests_test at ON a.id = at.assessment_id
                 LEFT JOIN
             test t ON at.test_id = t.id
        WHERE c.id = '${id}'
          AND c.status IN ('${CandidateStatus.ACTIVE}')
          AND a.status IN ('${AssessmentStatus.ACTIVE}', '${AssessmentStatus.PUBLISHED}')
        GROUP BY c.id, a.job_role
    `;

    const result: AssessmentOverviewById[] = await AppDataSource.query(query);
    return result[0];
  }
}
