import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { CreateMultipleChoiceQuestionCommandHandler } from '../command/create-multiple-choice-question.command-handler';
import { CreateMultipleChoiceQuestionRequestDto } from './create-multiple-choice-question-request.dto';
import { TestNotFoundError } from '../error/test-not-found.error';

@Controller('/multiple-choice-question')
export class CreateMultipleChoiceQuestionController {
  constructor(private handler: CreateMultipleChoiceQuestionCommandHandler) {}

  @Post()
  public async createQuestion(
    @Body() createQuestion: CreateMultipleChoiceQuestionRequestDto,
  ) {
    try {
      await this.handler.execute(createQuestion);
    } catch (error) {
      console.error(error);

      if (error instanceof TestNotFoundError) {
        throw new NotFoundException(
          `Test with id ${createQuestion.testId} not found`,
        );
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
