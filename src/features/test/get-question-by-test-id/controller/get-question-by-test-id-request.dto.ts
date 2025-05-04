import { IsOptional, IsString, MaxLength } from 'class-validator';

export class GetQuestionByTestIdRequestDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;
}
