import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from '../../../../entities/candidate.entity';
import { Repository } from 'typeorm';
import { CandidateNotFoundError } from '../error/candidate-not-found.error';
import { CandidateTracking } from '../../../../entities/candidate-tracking.entity';

Inject();

export class DeleteCandidateCommandHandler {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    @InjectRepository(CandidateTracking)
    private candidateTrackingRepository: Repository<CandidateTracking>,
  ) {}

  public async execute(id: string) {
    const candidate = await this.candidateRepository.findOne({
      where: { id },
    });

    if (!candidate) {
      throw new CandidateNotFoundError();
    }

    const candidateTracking = await this.candidateTrackingRepository.findOne({
      where: {
        candidate: {
          id: id,
        },
      },
      select: {
        id: true,
      },
    });

    if (candidateTracking) {
      await this.candidateTrackingRepository.delete(candidateTracking.id);
    }

    return await this.candidateRepository.delete(id);
  }
}
