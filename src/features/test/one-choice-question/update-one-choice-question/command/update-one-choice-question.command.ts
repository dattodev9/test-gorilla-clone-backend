import { Choice } from 'src/entities/one-choice-question.entity';

export class UpdateOneChoiceQuestionCommand {
  name: string;

  content: string;

  choices: Choice[];

  key: string;

  time: number;

  order: number;

  testId: string;
}
