import { TestCase } from '../../../../../entities/coding-question.entity';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class UpdateCodingQuestionRequestDto {
  @IsString()
  @Length(2, 100)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  initialCode?: string;

  @IsString()
  @IsOptional()
  callSnippet?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  testCases?: TestCase[];

  @IsOptional()
  @IsNumber()
  @Min(15)
  time?: number;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsString()
  testId: string;
}
