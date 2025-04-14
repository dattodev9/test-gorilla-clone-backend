export type QuestionAnswer = {
  id: string;
  answer: string;
  type: 'one-choice-question' | 'multiple-choice-question';
};

export type Test = {
  id: string;
  questionAnswers: QuestionAnswer[];
};

export class SubmitAssessmentCommand {
  tests: Test[];
}
