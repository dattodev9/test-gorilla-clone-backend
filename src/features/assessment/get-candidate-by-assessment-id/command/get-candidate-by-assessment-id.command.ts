import { PaginationRequestDto } from '../../../../common/pagination/pagination-request-dto';
import { CandidateStatus } from '../../../../entities/candidate.entity';

export class GetCandidateByAssessmentIdCommand extends PaginationRequestDto {
  name?: string;
  overallMin?: number;
  overallMax?: number;
  status?: CandidateStatus[];
}
