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

export class UpdateOneChoiceQuestionRequestDto {
  @IsString()
  @Length(2, 50)
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  choices: Choice[];

  @IsOptional()
  @IsString()
  key: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  time: number;

  @IsOptional()
  @IsNumber()
  order: number;

  @IsOptional()
  @IsString()
  testId: string;
}
