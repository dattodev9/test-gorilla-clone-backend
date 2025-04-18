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

export class UpdateMultipleChoiceQuestionRequestDto {
  @IsString()
  @Length(2, 100)
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsOptional()
  @ArrayMinSize(1)
  choices: Choice[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  key: string[];

  @IsOptional()
  @IsNumber()
  @Min(15)
  time: number;

  @IsOptional()
  @IsNumber()
  order: number;

  @IsOptional()
  @IsString()
  testId: string;
}
