import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { GetAssessmentViewByIdCommandHandler } from '../command/get-assessment-view-by-id.command-handler';

@Controller('/assessment/:id/view')
export class GetAssessmentViewByIdController {
  constructor(private handler: GetAssessmentViewByIdCommandHandler) {}

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
