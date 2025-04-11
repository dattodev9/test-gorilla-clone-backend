import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { UpdateMultipleChoiceQuestionCommandHandler } from '../command/update-multiple-choice-question.command-handler';
import { TestNotFoundError } from '../../../delete-test/error/test-not-found.error';
import { OneChoiceQuestionNotFound } from '../error/one-choice-question-not-found.error';
import { UpdateMultipleChoiceQuestionRequestDto } from './update-multiple-choice-question-request.dto';

@Controller('/multiple-choice-question')
export class UpdateMultipleChoiceQuestionController {
  constructor(private handler: UpdateMultipleChoiceQuestionCommandHandler) {}

  @Patch(':id')
  public async updateQuestion(
    @Param('id') id: string,
    @Body() createQuestion: UpdateMultipleChoiceQuestionRequestDto,
  ) {
    try {
      await this.handler.execute(id, createQuestion);
    } catch (error) {
      console.error(error);

      if (error instanceof TestNotFoundError) {
        throw new NotFoundException(
          `Test with id ${createQuestion.testId} not found`,
        );
      } else if (error instanceof OneChoiceQuestionNotFound) {
        throw new NotFoundException(
          `One choice question with id ${id} not found`,
        );
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
