import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Candidate,
  CandidateStatus,
} from '../../../../entities/candidate.entity';
import { Repository } from 'typeorm';
import { UpdateCandidateStatusCommand } from './update-candidate-status.command';
import { CandidateNotFoundError } from '../error/candidate-not-found.error';
import { CandidateStatusInvalidError } from '../error/candidate-status-invalid.error';

Inject();

export class UpdateCandidateStatusCommandHandler {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
  ) {}

  public async execute(id: string, command: UpdateCandidateStatusCommand) {
    const candidate = await this.candidateRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!candidate) {
      throw new CandidateNotFoundError();
    }

    if (candidate.status === CandidateStatus.DONE) {
      throw new CandidateStatusInvalidError();
    }

    return await this.candidateRepository.update(id, {
      status: command.status,
    });
  }
}
