import {
  Controller,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { DeleteCandidateCommandHandler } from '../command/delete-candidate.command-handler';
import { CandidateNotFoundError } from '../error/candidate-not-found.error';

@Controller('/candidate')
export class DeleteCandidateController {
  constructor(private handler: DeleteCandidateCommandHandler) {}

  @Delete(':id')
  public async deleteCandidate(@Param('id') id: string) {
    try {
      return await this.handler.execute(id);
    } catch (error) {
      console.error(error);

      if (error instanceof CandidateNotFoundError) {
        throw new NotFoundException('Candidate not found');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
