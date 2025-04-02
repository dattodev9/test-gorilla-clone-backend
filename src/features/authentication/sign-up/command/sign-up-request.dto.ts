import { Length } from '@nestjs/class-validator';

export class SignUpRequestDto {
  @Length(6, 15)
  username: string;

  @Length(6, 15)
  password: string;

  name: string;
}
