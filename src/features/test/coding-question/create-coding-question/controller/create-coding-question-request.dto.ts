import { TestCase } from '../../../../../entities/coding-question.entity';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { ArrayMinSize } from '@nestjs/class-validator';

export class CreateCodingQuestionRequestDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  initialCode: string;

  @IsString()
  callSnippet: string;

  @IsArray()
  @ArrayMinSize(1)
  testCases: TestCase[];

  @IsNumber()
  @Min(15)
  time: number;

  @IsNumber()
  order: number;

  @IsString()
  testId: string;
}
