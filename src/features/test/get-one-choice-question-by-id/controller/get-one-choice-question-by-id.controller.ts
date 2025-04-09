import { Controller, Get, InternalServerErrorException, Param } from '@nestjs/common';
import { GetOneChoiceQuestionByIdCommandHandler } from '../command/get-one-choice-question.command-handler';

@Controller("/one-choice-question")
export class GetOneChoiceQuestionByIdController {
  constructor(private handler: GetOneChoiceQuestionByIdCommandHandler) {}
  @Get(":id")
  public async getOneChoiceQuestionById(@Param("id") id: string) {
    try {
      return await this.handler.execute(id);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Something went wrong");
    }
  }
}