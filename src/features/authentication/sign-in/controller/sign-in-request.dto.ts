import { IsStrongPassword, Length } from 'class-validator';

export class SignInRequestDto {
  @Length(6, 15)
  username: string;

  @IsStrongPassword()
  password: string;
}
