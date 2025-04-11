import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MultipleChoiceQuestion } from 'src/entities/multiple-choice-question.entity';
import { OneChoiceQuestion } from 'src/entities/one-choice-question.entity';
import { Repository } from 'typeorm';

enum QuestionType {
  ONE_CHOICE_QUESTION = 'one-choice-question',
  MULTIPLE_CHOICE_QUESTION = 'multiple-choice-question',
}

export type Question = Omit<OneChoiceQuestion, 'key'> & {
  key: string | string[];
  type: QuestionType;
};

Inject();

export class GetQuestionByIdCommandHandler {
  constructor(
    @InjectRepository(OneChoiceQuestion)
    private oneChoiceQuestionRepository: Repository<OneChoiceQuestion>,
    @InjectRepository(MultipleChoiceQuestion)
    private multipleChoiceQuestionRepository: Repository<MultipleChoiceQuestion>,
  ) {}

  public async execute(testId: string) {
    const oneChoiceQuestionData = await this.oneChoiceQuestionRepository.find({
      where: {
        test: {
          id: testId,
        },
      },
    });

    const multipleChoiceQuestionData =
      await this.multipleChoiceQuestionRepository.find({
        where: {
          test: {
            id: testId,
          },
        },
      });

    return this.mergeAndSortTwoArrayByOrder(
      oneChoiceQuestionData,
      multipleChoiceQuestionData,
    );
  }

  private mergeAndSortTwoArrayByOrder(
    arr1: OneChoiceQuestion[],
    arr2: MultipleChoiceQuestion[],
  ): Question[] {
    const newArr1 = arr1.map((item) => {
      return {
        ...item,
        type: QuestionType.ONE_CHOICE_QUESTION,
      };
    });

    const newArr2 = arr2.map((item) => {
      return {
        ...item,
        type: QuestionType.MULTIPLE_CHOICE_QUESTION,
      };
    });

    return [...newArr1, ...newArr2].sort((a, b) => a.order - b.order);
  }
}
