import { ArrayMinSize } from '@nestjs/class-validator';
import { IsArray, IsNumber, IsString, Length, Min } from 'class-validator';
import { Choice } from 'src/entities/one-choice-question.entity';

export class CreateOneChoiceQuestionRequestDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsString()
  @Length(2, 500)
  content: string;

  @IsArray()
  @ArrayMinSize(1)
  choices: Choice[];

  @IsString()
  key: string;

  @IsNumber()
  @Min(15)
  time: number;

  @IsNumber()
  order: number;

  @IsString()
  testId: string;
}
