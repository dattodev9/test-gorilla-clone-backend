import { PaginationRequestDto } from '../../../../common/pagination/pagination-request-dto';
import { ArrayMaxSize, ArrayMinSize, IsEnum, IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { CandidateStatus } from '../../../../entities/candidate.entity';

export class GetCandidateByAssessmentIdRequestDto extends PaginationRequestDto {
  @IsString()
  @Length(2, 100)
  @IsOptional()
  name?: string;

  @IsEnum(CandidateStatus)
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsOptional()
  status?: CandidateStatus[];

  @IsNumber()
  @IsOptional()
  @Min(1)
  overallMin?: number;

  @IsNumber()
  @IsOptional()
  @Max(100)
  overallMax?: number;
}