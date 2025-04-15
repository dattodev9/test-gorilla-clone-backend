import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { UpdateCandidateStatusCommandHandler } from '../command/update-candidate-status.command-handler';
import { UpdateCandidateStatusRequestDto } from './update-candidate-status-request.dto';
import { CandidateNotFoundError } from '../error/candidate-not-found.error';

@Controller('/candidate')
export class UpdateCandidateStatusController {
  constructor(private handler: UpdateCandidateStatusCommandHandler) {}

  @Patch(':id')
  public async createCandidate(
    @Param('id') id: string,
    @Body() request: UpdateCandidateStatusRequestDto,
  ) {
    try {
      return await this.handler.execute(id, request);
    } catch (error) {
      console.error(error);

      if (error instanceof CandidateNotFoundError) {
        throw new NotFoundException('Assessment not found');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
