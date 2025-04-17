import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { AssessmentStatus } from 'src/entities/assessment.entity';

export class UpdateAssessmentRequestDto {
  @IsString()
  @Length(2, 100)
  @IsOptional()
  name?: string;

  @IsString()
  @Length(2, 100)
  @IsOptional()
  jobRole?: string;

  @IsArray()
  @IsOptional()
  testIds?: string[];

  @IsEnum(AssessmentStatus)
  @IsOptional()
  status?: AssessmentStatus;
}
