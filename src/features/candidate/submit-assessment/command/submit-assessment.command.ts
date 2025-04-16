export type QuestionAnswer = {
  id: string;
  answer: string;
  type: 'one-choice-question' | 'multiple-choice-question';
};

export type Test = {
  id: string;
  questionAnswers: QuestionAnswer[];
  time: number;
};

export class SubmitAssessmentCommand {
  tests: Test[];
}
