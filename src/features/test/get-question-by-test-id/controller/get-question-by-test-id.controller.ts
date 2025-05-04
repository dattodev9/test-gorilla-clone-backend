import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Query,
} from '@nestjs/common';
import {
  GetQuestionByTestIdCommandHandler,
  QuestionById,
} from '../command/get-question-by-test-id.command-handler';
import { GetQuestionByTestIdRequestDto } from './get-question-by-test-id-request.dto';

@Controller('/test/:id/question')
export class GetQuestionByIdController {
  constructor(private handler: GetQuestionByTestIdCommandHandler) {}

  @Get()
  public async getQuestionById(
    @Param('id') id: string,
    @Query() request: GetQuestionByTestIdRequestDto,
  ): Promise<QuestionById[]> {
    try {
      return await this.handler.execute(id, request);
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
