import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MultipleChoiceQuestion } from 'src/entities/multiple-choice-question.entity';
import { OneChoiceQuestion } from 'src/entities/one-choice-question.entity';
import { ILike, Repository } from 'typeorm';
import { CodingQuestion } from 'src/entities/coding-question.entity';
import { GetQuestionByTestIdCommand } from './get-question-by-test-id.command';

enum QuestionType {
  ONE_CHOICE_QUESTION = 'one-choice-question',
  MULTIPLE_CHOICE_QUESTION = 'multiple-choice-question',
  CODING_QUESTION = 'coding-question',
}

export type QuestionById = Partial<
  Omit<OneChoiceQuestion, 'key'> &
    Pick<CodingQuestion, 'testCases' | 'initialCode' | 'callSnippet'> & {
      key: string | string[];
      type: QuestionType;
    }
>;

Inject();

export class GetQuestionByTestIdCommandHandler {
  constructor(
    @InjectRepository(OneChoiceQuestion)
    private oneChoiceQuestionRepository: Repository<OneChoiceQuestion>,
    @InjectRepository(MultipleChoiceQuestion)
    private multipleChoiceQuestionRepository: Repository<MultipleChoiceQuestion>,
    @InjectRepository(CodingQuestion)
    private codingQuestionRepository: Repository<CodingQuestion>,
  ) {}

  public async execute(testId: string, command: GetQuestionByTestIdCommand) {
    const oneChoiceQuestionData = await this.oneChoiceQuestionRepository.find({
      where: {
        test: {
          id: testId,
        },
        ...(command.name && { name: ILike(`%${command.name}%`) }),
      },
    });

    const multipleChoiceQuestionData =
      await this.multipleChoiceQuestionRepository.find({
        where: {
          test: {
            id: testId,
          },
          ...(command.name && { name: ILike(`%${command.name}%`) }),
        },
      });

    const codingQuestionData = await this.codingQuestionRepository.find({
      where: {
        test: {
          id: testId,
        },
        ...(command.name && { name: ILike(`%${command.name}%`) }),
      },
    });

    if (!command?.questionType) {
      return this.mergeAndSortArrayByOrder(
        oneChoiceQuestionData,
        multipleChoiceQuestionData,
        codingQuestionData,
      );
    }

    return this.mergeAndSortArrayByOrder(
      command.questionType?.includes(QuestionType.ONE_CHOICE_QUESTION)
        ? oneChoiceQuestionData
        : [],
      command.questionType?.includes(QuestionType.MULTIPLE_CHOICE_QUESTION)
        ? multipleChoiceQuestionData
        : [],
      command.questionType?.includes(QuestionType.CODING_QUESTION)
        ? codingQuestionData
        : [],
    );
  }

  private mergeAndSortArrayByOrder(
    arr1: OneChoiceQuestion[],
    arr2: MultipleChoiceQuestion[],
    arr3: CodingQuestion[],
  ): QuestionById[] {
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

    const newArr3 = arr3.map((item) => {
      return {
        ...item,
        type: QuestionType.CODING_QUESTION,
      };
    });

    return [...newArr1, ...newArr2, ...newArr3].sort(
      (a, b) => a.order - b.order,
    );
  }
}
