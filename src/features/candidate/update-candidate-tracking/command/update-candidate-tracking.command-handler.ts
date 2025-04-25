import { InjectRepository } from '@nestjs/typeorm';
import { CandidateTracking } from 'src/entities/candidate-tracking.entity';
import { Repository } from 'typeorm';
import { UpdateCandidateTrackingCommand } from './update-candidate-tracking.command';
import { CandidateTrackingNotFoundError } from '../error/candidate-tracking-not-found.error';
import { removeUndefinedAttribute } from 'src/shared/remove-undefined-attribute';

export class UpdateCandidateTrackingCommandHandler {
  constructor(
    @InjectRepository(CandidateTracking)
    private candidateTrackingRepository: Repository<CandidateTracking>,
  ) {}

  public async execute(id: string, command: UpdateCandidateTrackingCommand) {
    const candidateTracking = await this.candidateTrackingRepository.findOne({
      where: {
        candidate: {
          id,
        },
      },
      relations: ['candidate'],
    });

    if (!candidateTracking) {
      throw new CandidateTrackingNotFoundError();
    }

    const processedCommand = removeUndefinedAttribute(command);

    return await this.candidateTrackingRepository.update(
      candidateTracking.id,
      processedCommand,
    );
  }
}
