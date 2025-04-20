import { IsString, Length } from 'class-validator';

export class SignInRequestDto {
  @Length(6, 15)
  @IsString()
  username: string;

  @Length(8, 50)
  @IsString()
  password: string;
}
