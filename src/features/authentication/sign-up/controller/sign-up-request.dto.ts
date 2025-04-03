import { Length } from '@nestjs/class-validator';
import { IsStrongPassword } from 'class-validator';

export class SignUpRequestDto {
  @Length(6, 15)
  username: string;

  @IsStrongPassword()
  password: string;

  @Length(2, 30)
  name: string;
}
