import { UserRole } from '../../../../entities/user.entity';

export class UpdateUserCommand {
  name?: string;
  role?: UserRole;
  password?: string;
}
