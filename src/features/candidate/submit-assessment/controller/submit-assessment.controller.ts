import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { SubmitAssessmentCommandHandler } from '../command/submit-assessment.command-handler';
import { SubmitAssessmentRequestDto } from './submit-assessment-request.dto';
import { CandidateNotFoundError } from '../error/candidate-not-found.error';
import { CandidateStatusInvalidError } from '../error/candidate-status-invalid.error';
import { QuestionNotFoundError } from '../error/question-not-found.error';
import { TestNotFoundError } from '../error/test-not-found.error';

@Controller('candidate/:id/submit-assessment')
export class SubmitAssessmentController {
  constructor(private handler: SubmitAssessmentCommandHandler) {}

  @Post()
  public async submitAssessment(
    @Param('id') id: string,
    @Body() request: SubmitAssessmentRequestDto,
  ) {
    try {
      const result = await this.handler.execute(id, request);
      return { success: true, score: result };
    } catch (error) {
      console.error(error);

      if (error instanceof CandidateNotFoundError) {
        throw new NotFoundException('Candidate not found');
      }

      if (error instanceof CandidateStatusInvalidError) {
        throw new BadRequestException('Candidate status is invalid');
      }

      if (error instanceof TestNotFoundError) {
        throw new NotFoundException('Test not found');
      }

      if (error instanceof QuestionNotFoundError) {
        throw new NotFoundException('Question not found');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
