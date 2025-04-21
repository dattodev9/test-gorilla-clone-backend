import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { RunCodingQuestionCommandHandler } from '../command/run-coding-question.command-handler';
import { RunCodingQuestionRequestDto } from './run-coding-question-request.dto';
import { CodingQuestionNotFound } from '../../update-coding-question/error/coding-question-not-found.error';

@Controller('/coding-question/:id/run')
export class RunCodingQuestionController {
  constructor(private handler: RunCodingQuestionCommandHandler) {}

  @Post()
  public async runCodingQuestion(
    @Param('id') id: string,
    @Body() request: RunCodingQuestionRequestDto,
  ) {
    try {
      return await this.handler.execute(id, request);
    } catch (e) {
      console.error(e);

      if (e instanceof CodingQuestionNotFound) {
        throw new NotFoundException(`Question with id ${id} not found`);
      }

      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
