import { Body, Controller, InternalServerErrorException, NotFoundException, Param, Patch } from '@nestjs/common';
import { UpdateOneChoiceQuestionCommandHandler } from '../command/update-one-choice-question.command-handler';
import { UpdateOneChoiceQuestionRequestDto } from './update-one-choice-question-request.dto';
import { TestNotFoundError } from '../../../delete-test/error/test-not-found.error';
import { OneChoiceQuestionNotFound } from '../error/one-choice-question-not-found.error';

@Controller('/one-choice-question')
export class UpdateOneChoiceQuestionController {
  constructor(
    private handler: UpdateOneChoiceQuestionCommandHandler,
  ) {
  }

  @Patch(':id')
  public async updateQuestion(@Param('id') id: string, @Body() createQuestion: UpdateOneChoiceQuestionRequestDto) {
    try {
      await this.handler.execute(id, createQuestion);
    } catch (error) {
      console.error(error);

      if (error instanceof TestNotFoundError) {
        throw new NotFoundException(`Test with id ${createQuestion.testId} not found`);
      } else if (error instanceof OneChoiceQuestionNotFound) {
        throw new NotFoundException(`One choice question with id ${id} not found`);
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}