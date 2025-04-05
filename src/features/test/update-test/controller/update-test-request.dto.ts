import { IsString, Length } from 'class-validator';

export class UpdateTestRequestDto {
  @Length(2, 50)
  @IsString()
  name: string;

  @Length(2, 100)
  @IsString()
  description: string;
}