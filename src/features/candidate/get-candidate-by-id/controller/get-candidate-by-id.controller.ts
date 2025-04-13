import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { GetCandidateByIdCommandHandler } from '../command/get-candidate-by-id.command-handler';
import { CandidateNotFoundError } from '../error/candidate-not-found.error';

@Controller('/candidate')
export class GetCandidateByIdController {
  constructor(private handler: GetCandidateByIdCommandHandler) {}

  @Get(':id')
  public async getCandidateById(@Param('id') id: string) {
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
