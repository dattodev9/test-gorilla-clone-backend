import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from '../../../../entities/candidate.entity';
import { Repository } from 'typeorm';
import { CandidateNotFoundError } from '../error/candidate-not-found.error';

Inject();

export class DeleteCandidateCommandHandler {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
  ) {}

  public async execute(id: string) {
    const candidate = await this.candidateRepository.findOne({ where: { id } });

    if (!candidate) {
      throw new CandidateNotFoundError();
    }

    return await this.candidateRepository.delete(id);
  }
}