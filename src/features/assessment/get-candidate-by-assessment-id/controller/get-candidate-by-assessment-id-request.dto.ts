import { PaginationRequestDto } from '../../../../common/pagination/pagination-request-dto';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { CandidateStatus } from '../../../../entities/candidate.entity';
import { Transform } from 'class-transformer';

export class GetCandidateByAssessmentIdRequestDto extends PaginationRequestDto {
  @IsString()
  @Length(2, 100)
  @IsOptional()
  name?: string;

  @IsEnum(CandidateStatus, { each: true })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
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
