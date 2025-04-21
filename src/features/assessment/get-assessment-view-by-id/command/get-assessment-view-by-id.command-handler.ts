import { Inject } from '@nestjs/common';
import { AppDataSource } from '../../../../shared/app-data-source';
import { OneChoiceQuestion } from '../../../../entities/one-choice-question.entity';
import { Test } from '../../../../entities/test.entity';
import { CodingQuestion } from '../../../../entities/coding-question.entity';

export type QuestionList = Pick<
  OneChoiceQuestion,
  'id' | 'name' | 'content' | 'choices' | 'time' | 'order'
> &
  Pick<CodingQuestion, 'testCases' | 'initialCode'> & {
    type:
      | 'one-choice-question'
      | 'multiple-choice-question'
      | 'coding-question';
  };

export type TestList = Pick<Test, 'id' | 'name'> & {
  totalQuestions: string;
  totalTime: string;
  questionList: QuestionList[];
};

export type AssessmentViewById = {
  testList: TestList[];
};

Inject();

export class GetAssessmentViewByIdCommandHandler {
  constructor() {}

  public async execute(id: string) {
    return await this.getAssessmentViewById(id);
  }

  private async getAssessmentViewById(
    id: string,
  ): Promise<AssessmentViewById[]> {
    const query = `
        SELECT t.id        AS "id",
               t.name      AS "name",
               COUNT(q.id) AS "totalQuestions",
               SUM(q.time) AS "totalTime",
               JSON_AGG(
                       JSON_BUILD_OBJECT(
                               'id', q.id,
                               'name', q.name,
                               'content', q.content,
                               'initialCode', q.initial_code,
                               'testCases', q.test_cases,
                               'choices', q.choices,
                               'time', q.time,
                               'order', q.order,
                               'type', q.type
                       )
                       ORDER BY q.order
               )           AS "questionList"
        FROM test t
                 LEFT JOIN (SELECT ocq.id,
                                   ocq.name,
                                   ocq.content,
                                   ocq.choices,
                                   ocq.time,
                                   ocq.order,
                                   NULL::text                  AS "initial_code",
                                   NULL::jsonb                 AS "test_cases",
                                   ocq.test_id,
                                   'one-choice-question' AS type
                            FROM one_choice_question ocq
                            UNION ALL
                            SELECT mcq.id,
                                   mcq.name,
                                   mcq.content,
                                   mcq.choices,
                                   mcq.time,
                                   mcq.order,
                                   NULL::text                  AS "initial_code",
                                   NULL::jsonb                 AS "test_cases",
                                   mcq.test_id,
                                   'multiple-choice-question' AS type
                            FROM multiple_choice_question mcq
                            UNION ALL
                            SELECT cq.id,
                                   cq.name,
                                   cq.content,
                                   NULL                                               AS "choices",
                                   cq.time,
                                   cq.order,
                                   cq.initial_code                                    AS "initial_code",
                                   jsonb_path_query_array(cq.test_cases, '$[0 to 2]') AS "test_cases",
                                   cq.test_id,
                                   'coding-question'                                  AS type
                            FROM coding_question cq) q
                           ON t.id = q.test_id
                 LEFT JOIN assessment_tests_test att ON t.id = att.test_id
                 LEFT JOIN assessment a ON att.assessment_id = a.id
        WHERE a.id = $1
        GROUP BY t.id
    `;

    return await AppDataSource.query(query, [id]);
  }
}
