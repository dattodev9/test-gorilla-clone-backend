import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from '../../../../entities/candidate.entity';
import { Repository } from 'typeorm';
import { GetCandidateCommand } from './get-candidate.command';
import { removeUndefinedAttribute } from '../../../../common/remove-undefined-attribute';

Inject();

export class GetCandidateCommandHandler {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
  ) {}

  public async execute(command: GetCandidateCommand) {
    const processedCommand = removeUndefinedAttribute(command);

    return await this.candidateRepository.find({
      where: {
        name: processedCommand?.name,
        email: processedCommand?.email,
        status: processedCommand?.status,
        assessment: {
          id: processedCommand?.assessmentId,
        },
      },
      skip: (processedCommand?.page ?? 1) - 1,
      take: processedCommand?.size ?? 10,
    });
  }
}
