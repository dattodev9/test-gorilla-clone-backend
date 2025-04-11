import { IsStrongPassword, Length } from 'class-validator';

export class ChangePasswordRequestDto {
  @Length(6, 15)
  username: string;

  @IsStrongPassword()
  newPassword: string;
}
