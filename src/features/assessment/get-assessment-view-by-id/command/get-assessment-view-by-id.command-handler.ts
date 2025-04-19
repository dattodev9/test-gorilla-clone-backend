import { Inject } from '@nestjs/common';
import { AppDataSource } from '../../../../shared/app-data-source';
import { OneChoiceQuestion } from '../../../../entities/one-choice-question.entity';
import { Test } from '../../../../entities/test.entity';

export type QuestionList = Pick<
  OneChoiceQuestion,
  'id' | 'name' | 'content' | 'choices' | 'time' | 'order'
> & {
  type: 'one-choice-question' | 'multiple-choice-question';
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
        SELECT t.id                     AS "id",
               t.name                   AS "name",
               COALESCE(COUNT(q.id), 0) AS "totalQuestions",
               COALESCE(SUM(q.time), 0) AS "totalTime",
               COALESCE(
                       JSON_AGG(
                               JSON_BUILD_OBJECT(
                                       'id', q.id,
                                       'name', q.name,
                                       'content', q.content,
                                       'choices', q.choices,
                                       'time', q.time,
                                       'order', q.order,
                                       'type', q.type
                               ) ORDER BY q.order
                       ),
                       '[]'
               )                        AS "questionList"
        FROM test t
                 LEFT JOIN (SELECT ocq.id,
                                   ocq.name,
                                   ocq.content,
                                   ocq.choices,
                                   ocq.time,
                                   ocq.order,
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
                                   mcq.test_id,
                                   'multiple-choice-question' AS type
                            FROM multiple_choice_question mcq) q ON t.id = q.test_id
                 LEFT JOIN assessment_tests_test att ON t.id = att.test_id
                 LEFT JOIN assessment a ON att.assessment_id = a.id
        WHERE a.id = $1
        GROUP BY t.id
    `;

    return await AppDataSource.query(query, [id]);
  }
}
