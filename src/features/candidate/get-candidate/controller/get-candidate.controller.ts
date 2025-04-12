import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { GetCandidateCommandHandler } from '../command/get-candidate.command-handler';
import { GetCandidateRequestDto } from './get-candidate-request.dto';

@Controller('/candidate')
export class GetCandidateController {
  constructor(private handler: GetCandidateCommandHandler) {}

  @Get()
  public async getCandidate(@Query() request: GetCandidateRequestDto) {
    try {
      return await this.handler.execute(request);
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
