import { TestCase } from '../../../../../entities/coding-question.entity';

export class CreateOneChoiceQuestionCommand {
  name: string;

  content: string;

  testCases: TestCase[];

  time: number;

  order: number;

  testId: string;
}
