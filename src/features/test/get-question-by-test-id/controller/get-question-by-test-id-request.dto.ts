import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { QuestionType } from 'src/entities/test.entity';
import { Transform } from 'class-transformer';

export class GetQuestionByTestIdRequestDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsEnum(QuestionType, { each: true })
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  questionType?: string;
}
