import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { CreateCandidateCommandHandler } from '../command/create-candidate.command-handler';
import { CreateCandidateRequestDto } from './create-candidate-request.dto';
import { AssessmentNotFoundError } from '../error/assessment-not-found.error';

@Controller('/candidate')
export class CreateCandidateController {
  constructor(private handler: CreateCandidateCommandHandler) {}

  @Post()
  public async createCandidate(@Body() request: CreateCandidateRequestDto) {
    try {
      return await this.handler.execute(request);
    } catch (error) {
      console.error(error);

      if (error instanceof AssessmentNotFoundError) {
        throw new NotFoundException('Assessment not found');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
