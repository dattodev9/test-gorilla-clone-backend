import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { GetOneChoiceQuestionByTestIdCommandHandler } from '../command/get-one-choice-question.command-handler';

@Controller('/test/:testId/one-choice-question')
export class GetOneChoiceQuestionByTestIdController {
  constructor(private handler: GetOneChoiceQuestionByTestIdCommandHandler) {}
  @Get()
  public async getOneChoiceQuestionByTestId(@Param('testId') testId: string) {
    try {
      return await this.handler.execute(testId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
