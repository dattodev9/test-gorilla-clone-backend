import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { CreateCodingQuestionCommandHandler } from '../command/create-coding-question.command-handler';
import { CreateCodingQuestionRequestDto } from './create-coding-question-request.dto';
import { TestNotFoundError } from '../../../one-choice-question/create-one-choice-question/error/test-not-found.error';

@Controller('/coding-question')
export class CreateCodingQuestionController {
  constructor(private handler: CreateCodingQuestionCommandHandler) {}

  @Post()
  public async createCodingQuestion(
    @Body() request: CreateCodingQuestionRequestDto,
  ) {
    try {
      return await this.handler.execute(request);
    } catch (e) {
      console.error(e);

      if (e instanceof TestNotFoundError) {
        throw new NotFoundException(`Test with id ${request.testId} not found`);
      }
    }
  }
}
