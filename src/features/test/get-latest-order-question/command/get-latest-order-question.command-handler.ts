import { Inject } from '@nestjs/common';
import { MultipleChoiceQuestion } from 'src/entities/multiple-choice-question.entity';
import { OneChoiceQuestion } from 'src/entities/one-choice-question.entity';
import { DataSource } from 'typeorm';

Inject();

export class GetLatestOrderQuestionCommandHandler {
  constructor(
    @Inject(DataSource)
    private datasource: DataSource,
  ) {
  }

  public async execute(testId: string) {
    const latestOrderOneChoiceQuestion = await this.datasource.createQueryBuilder()
      .select('one_choice_question.order', 'order')
      .from(OneChoiceQuestion, 'one_choice_question')
      .where('one_choice_question.test_id = :testId', { testId })
      .orderBy('one_choice_question.order', 'DESC')
      .limit(1)
      .getRawOne<{
        order: string
      }>();


    const latestOrderMultipleChoiceQuestion = await this.datasource.createQueryBuilder()
      .select('multiple_choice_question.order', 'order')
      .from(MultipleChoiceQuestion, 'multiple_choice_question')
      .where('multiple_choice_question.test_id = :testId', { testId })
      .orderBy('multiple_choice_question.order', 'DESC')
      .limit(1)
      .getRawOne<{
        order: string
      }>();

    console.log(Math.max(Number(latestOrderOneChoiceQuestion?.order ?? 0), Number(latestOrderMultipleChoiceQuestion?.order ?? 0)));
    return Math.max(Number(latestOrderOneChoiceQuestion?.order ?? 0), Number(latestOrderMultipleChoiceQuestion?.order ?? 0));
  }
}