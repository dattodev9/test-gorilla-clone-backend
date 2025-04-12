import { IsString, Length } from 'class-validator';

export class CreateCandidateRequestDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsString()
  @Length(2, 50)
  email: string;

  @IsString()
  assessmentId: string;
}
