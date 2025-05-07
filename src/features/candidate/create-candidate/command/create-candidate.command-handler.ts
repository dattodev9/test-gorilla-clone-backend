import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from '../../../../entities/candidate.entity';
import { Not, Repository } from 'typeorm';
import { CreateCandidateCommand } from './create-candidate.command';
import {
  Assessment,
  AssessmentStatus,
} from '../../../../entities/assessment.entity';
import { AssessmentNotFoundError } from '../error/assessment-not-found.error';
import { CandidateTracking } from 'src/entities/candidate-tracking.entity';

Inject();

export class CreateCandidateCommandHandler {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    @InjectRepository(Assessment)
    private assessmentRepository: Repository<Assessment>,
    @InjectRepository(CandidateTracking)
    private candidateTrackingRepository: Repository<CandidateTracking>,
  ) {}

  public async execute(command: CreateCandidateCommand) {
    const assessment = await this.assessmentRepository.findOne({
      where: {
        id: command.assessmentId,
        status: Not(AssessmentStatus.ARCHIVED),
      },
    });

    if (!assessment) {
      throw new AssessmentNotFoundError();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { assessmentId } = command;

    const newCandidate = await this.candidateRepository.save({
      ...command,
      assessment: assessment,
    });

    return await this.candidateTrackingRepository.save(
      this.candidateTrackingRepository.create({
        candidate: {
          id: newCandidate.id,
        },
      }),
    );
  }
}
