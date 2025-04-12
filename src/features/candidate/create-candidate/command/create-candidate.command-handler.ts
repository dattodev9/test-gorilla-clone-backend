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

Inject();

export class CreateCandidateCommandHandler {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    @InjectRepository(Assessment)
    private assessmentRepository: Repository<Assessment>,
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

    const { assessmentId } = command;

    return await this.candidateRepository.save({
      ...command,
      assessment: assessment,
    });
  }
}
