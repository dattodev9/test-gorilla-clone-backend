import { IsArray, IsString, Length } from 'class-validator';

export class CreateAssessmentRequestDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsString()
  @Length(2, 100)
  jobRole: string;

  @IsArray()
  testIds: string[];
}
