import { SubmitType } from '../controller/run-coding-question-request.dto';

export class RunCodingQuestionCommand {
  code: string;
  type: SubmitType;
}
