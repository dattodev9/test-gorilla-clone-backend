import { IsEnum, IsString } from 'class-validator';

export enum SubmitType {
  RUN = 'run',
  SUBMIT = 'submit',
}

export class RunCodingQuestionRequestDto {
  @IsString()
  code: string;

  @IsEnum(SubmitType)
  type: SubmitType;
}
