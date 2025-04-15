import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Query,
} from '@nestjs/common';
import { GetCandidateByAssessmentIdCommandHandler } from '../command/get-candidate-by-assessment-id.command-handler';
import { GetCandidateByAssessmentIdRequestDto } from './get-candidate-by-assessment-id-request.dto';

@Controller('/assessment/:id/candidate')
export class GetCandidateByAssessmentIdController {
  constructor(private handler: GetCandidateByAssessmentIdCommandHandler) {}

  @Get()
  public async getCandidateByAssessmentId(
    @Param('id') id: string,
    @Query() request: GetCandidateByAssessmentIdRequestDto,
  ) {
    try {
      return await this.handler.execute(id, request);
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
