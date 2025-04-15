import { IsEnum } from 'class-validator';
import { CandidateStatus } from '../../../../entities/candidate.entity';

export class UpdateCandidateStatusRequestDto {
  @IsEnum(CandidateStatus)
  status: CandidateStatus.ACTIVE | CandidateStatus.CANCELED;
}
