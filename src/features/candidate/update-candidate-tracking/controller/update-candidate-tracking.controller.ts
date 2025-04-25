import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { UpdateCandidateTrackingCommandHandler } from '../command/update-candidate-tracking.command-handler';
import { UpdateCandidateTrackingCommand } from '../command/update-candidate-tracking.command';
import { CandidateTrackingNotFoundError } from '../error/candidate-tracking-not-found.error';
@Controller('/candidate/:id/tracking')
export class UpdateCandidateTrackingController {
  constructor(private handler: UpdateCandidateTrackingCommandHandler) {}

  @Patch()
  public async updateCandidateTracking(
    @Param('id') id: string,
    @Body() command: UpdateCandidateTrackingCommand,
  ) {
    try {
      return await this.handler.execute(id, command);
    } catch (error) {
      console.error(error);

      if (error instanceof CandidateTrackingNotFoundError) {
        throw new NotFoundException('Candidate not found!');
      }

      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
