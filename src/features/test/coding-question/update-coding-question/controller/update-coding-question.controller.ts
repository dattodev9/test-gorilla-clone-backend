import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { UpdateCodingQuestionCommandHandler } from '../command/update-coding-question.command-handler';
import { UpdateCodingQuestionRequestDto } from './update-coding-question-request.dto';
import { TestNotFoundError } from '../error/test-not-found.error';
import { CodingQuestionNotFound } from '../error/coding-question-not-found.error';

@Controller('/coding-question')
export class UpdateCodingQuestionController {
  constructor(private handler: UpdateCodingQuestionCommandHandler) {}

  @Patch('/:id')
  public async updateCodingQuestion(
    @Param('id') id: string,
    @Body() request: UpdateCodingQuestionRequestDto,
  ) {
    try {
      return await this.handler.execute(id, request);
    } catch (e) {
      console.error(e);

      if (e instanceof TestNotFoundError) {
        throw new NotFoundException(`Test with id ${request.testId} not found`);
      } else if (e instanceof CodingQuestionNotFound) {
        throw new NotFoundException(
          `One choice question with id ${id} not found`,
        );
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
