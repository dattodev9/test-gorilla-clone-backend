import { IsOptional, Length } from 'class-validator';

export class UpdateTestCommand {
  @Length(2, 50)
  @IsOptional()
  name?: string;

  @Length(2, 100)
  @IsOptional()
  description?: string;
}