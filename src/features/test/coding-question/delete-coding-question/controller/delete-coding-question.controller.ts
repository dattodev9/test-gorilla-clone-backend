import {
  Controller,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { DeleteCodingQuestionCommandHandler } from '../command/delete-coding-question.command-handler';
import { CodingQuestionNotFoundError } from '../error/coding-question-not-found.error';

@Controller('/coding-question')
export class DeleteCodingQuestionController {
  constructor(private handler: DeleteCodingQuestionCommandHandler) {}

  @Delete('/:id')
  public async deleteCodingQuestion(@Param('id') id: string) {
    try {
      return await this.handler.execute(id);
    } catch (e) {
      console.error(e);

      if (e instanceof CodingQuestionNotFoundError) {
        throw new NotFoundException(`Coding question with id ${id} not found`);
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
