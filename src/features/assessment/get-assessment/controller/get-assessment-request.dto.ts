import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationRequestDto } from 'src/common/pagination/pagination-request-dto';
import { AssessmentStatus } from 'src/entities/assessment.entity';
import { Transform } from 'class-transformer';

export class GetAssessmentRequestDto extends PaginationRequestDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsEnum(AssessmentStatus, { each: true })
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  status?: AssessmentStatus[];
}
