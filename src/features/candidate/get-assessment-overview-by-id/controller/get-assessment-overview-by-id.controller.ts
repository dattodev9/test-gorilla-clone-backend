import {
  Controller, Get,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { GetAssessmentOverviewByIdCommandHandler } from '../command/get-assessment-overview-by-id.command-handler';

@Controller('/candidate/:id/assessment-overview')
export class GetAssessmentOverviewByIdController {
  constructor(private handler: GetAssessmentOverviewByIdCommandHandler) {}

  @Get()
  public async getAssessmentOverviewById(@Param('id') id: string) {
    try {
      return await this.handler.execute(id);
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
