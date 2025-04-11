import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { GetMultipleChoiceQuestionByTestIdCommandHandler } from '../command/get-multiple-choice-question.command-handler';

@Controller('/test/:testId/multiple-choice-question')
export class GetMultipleChoiceQuestionByTestIdController {
  constructor(
    private handler: GetMultipleChoiceQuestionByTestIdCommandHandler,
  ) {}
  @Get()
  public async getMultipleChoiceQuestionByTestId(
    @Param('testId') testId: string,
  ) {
    try {
      return await this.handler.execute(testId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
