import { Length } from '@nestjs/class-validator';

export class SignUpCommand {
  @Length(6, 15)
  username: string;

  @Length(6, 15)
  password: string;

  @Length(2, 30)
  name: string;
}
