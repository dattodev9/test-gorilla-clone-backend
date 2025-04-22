import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { GetAssessmentByIdCommandHandler } from '../command/get-assessment-by-id.command-handler';
import { CandidateNotFoundError } from '../error/candidate-not-found.error';
import { CandidateStatusInvalidError } from '../error/candidate-status-invalid.error';

@Controller('/candidate/:id/assessment')
export class GetAssessmentByIdController {
  constructor(private handler: GetAssessmentByIdCommandHandler) {}

  @Get()
  public async getAssessmentById(@Param('id') id: string) {
    try {
      return await this.handler.execute(id);
    } catch (error) {
      console.error(error);
      if (error instanceof CandidateNotFoundError) {
        throw new NotFoundException('Candidate not found!');
      }
      if (error instanceof CandidateStatusInvalidError) {
        throw new BadRequestException('Candidate status invalid!');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
