import {
  Controller, Get,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { GetAssessmentByIdCommandHandler } from '../command/get-assessment-by-id.command-handler';

@Controller('/candidate/:id/assessment')
export class GetAssessmentByIdController {
  constructor(private handler: GetAssessmentByIdCommandHandler) {}

  @Get()
  public async getAssessmentById(@Param('id') id: string) {
    try {
      return await this.handler.execute(id);
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
