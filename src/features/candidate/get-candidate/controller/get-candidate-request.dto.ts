import { PaginationRequestDto } from '../../../../common/pagination/pagination-request-dto';
import { CandidateStatus } from '../../../../entities/candidate.entity';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetCandidateRequestDto extends PaginationRequestDto {
  @IsString()
  @Length(2, 100)
  @IsOptional()
  name?: string;

  @IsString()
  @Length(2, 50)
  @IsOptional()
  email?: string;

  @IsEnum(CandidateStatus, { each: true })
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  status?: CandidateStatus[];

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  overallMin?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Max(100)
  overallMax?: number;
}
