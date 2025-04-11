import {
  Controller,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { DeleteMultipleChoiceQuestionCommandHandler } from '../command/delete-multiple-choice-question.command-handler';
import { MultipleChoiceQuestionNotFound } from '../error/one-choice-question-not-found.error';

@Controller('/multiple-choice-question')
export class DeleteMultipleChoiceQuestionController {
  constructor(private handler: DeleteMultipleChoiceQuestionCommandHandler) {}

  @Delete(':id')
  public async updateQuestion(@Param('id') id: string) {
    try {
      await this.handler.execute(id);
    } catch (error) {
      console.error(error);

      if (error instanceof MultipleChoiceQuestionNotFound) {
        throw new NotFoundException(
          `Multiple choice question with id ${id} not found`,
        );
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
