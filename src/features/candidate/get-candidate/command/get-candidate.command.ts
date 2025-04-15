import { PaginationRequestDto } from '../../../../common/pagination/pagination-request-dto';
import { CandidateStatus } from '../../../../entities/candidate.entity';

export class GetCandidateCommand extends PaginationRequestDto {
  name?: string;
  email?: string;
  status?: CandidateStatus[];
  overallMin?: number;
  overallMax?: number;
}
