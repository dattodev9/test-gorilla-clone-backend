import { UserRole } from '../../../../entities/user.entity';

export class CreateUserCommand {
  username: string;
  name: string;
  role: UserRole;
  password: string;
}
