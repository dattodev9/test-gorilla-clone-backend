import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { GetMultipleChoiceQuestionByIdCommandHandler } from '../command/get-multiple-choice-question.command-handler';

@Controller('/multiple-choice-question')
export class GetMultipleChoiceQuestionByIdController {
  constructor(private handler: GetMultipleChoiceQuestionByIdCommandHandler) {}
  @Get(':id')
  public async getMultipleChoiceQuestionById(@Param('id') id: string) {
    try {
      return await this.handler.execute(id);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
