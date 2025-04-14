import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QuestionAnswer {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsString()
  @IsIn(['one-choice-question', 'multiple-choice-question'])
  type: 'one-choice-question' | 'multiple-choice-question';
}

export class Test {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswer)
  questionAnswers: QuestionAnswer[];
}

export class SubmitAssessmentRequestDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Test)
  tests: Test[];
}
