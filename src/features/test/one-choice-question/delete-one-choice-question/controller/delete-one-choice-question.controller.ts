import {
  Controller,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { DeleteOneChoiceQuestionCommandHandler } from '../command/delete-one-choice-question.command-handler';
import { OneChoiceQuestionNotFound } from '../error/one-choice-question-not-found.error';

@Controller('/one-choice-question')
export class DeleteOneChoiceQuestionController {
  constructor(
    private handler: DeleteOneChoiceQuestionCommandHandler,
  ) {
  }

  @Delete(':id')
  public async updateQuestion(@Param('id') id: string) {
    try {
      await this.handler.execute(id);
    } catch (error) {
      console.error(error);

      if (error instanceof OneChoiceQuestionNotFound) {
        throw new NotFoundException(`One choice question with id ${id} not found`);
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}