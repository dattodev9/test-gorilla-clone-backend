import { PaginationRequestDto } from '../../../../common/pagination/pagination-request-dto';
import { CandidateStatus } from '../../../../entities/candidate.entity';
import { IsEnum, IsOptional, IsString, Length, Max } from 'class-validator';

export class GetCandidateRequestDto extends PaginationRequestDto {
  @IsString()
  @Length(2, 100)
  @IsOptional()
  name?: string;

  @IsString()
  @Length(2, 50)
  @IsOptional()
  email?: string;

  @IsEnum(CandidateStatus)
  @Max(20)
  @IsOptional()
  status?: CandidateStatus;

  @IsString()
  @IsOptional()
  assessmentId?: string;
}
