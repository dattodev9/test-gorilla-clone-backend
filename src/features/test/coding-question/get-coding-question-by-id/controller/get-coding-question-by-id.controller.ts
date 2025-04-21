import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { GetCodingQuestionByIdCommandHandler } from '../command/get-coding-question-by-id.command-handler';

@Controller('/coding-question')
export class GetCodingQuestionByIdController {
  constructor(private handler: GetCodingQuestionByIdCommandHandler) {}

  @Get(':id')
  public async getCodingQuestionById(@Param('id') id: string) {
    try {
      return await this.handler.execute(id);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
