import { TestCase } from '../../../../../entities/coding-question.entity';
import { IsArray, IsNumber, IsString, Length, Min } from 'class-validator';
import { ArrayMinSize } from '@nestjs/class-validator';

export class CreateCodingQuestionRequestDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsString()
  content: string;

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
