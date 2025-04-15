import { CandidateStatus } from '../../../../entities/candidate.entity';

export class UpdateCandidateStatusCommand {
  status: CandidateStatus.ACTIVE | CandidateStatus.CANCELED;
}
