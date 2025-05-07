import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Choice } from 'src/entities/one-choice-question.entity';

export class CreateMultipleChoiceQuestionRequestDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @ArrayMinSize(1)
  choices: Choice[];

  @IsArray()
  @ArrayMinSize(1)
  key: string[];

  @IsNumber()
  @Min(15)
  time: number;

  @IsNumber()
  order: number;

  @IsString()
  testId: string;
}
