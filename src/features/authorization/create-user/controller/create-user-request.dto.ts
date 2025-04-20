import { UserRole } from '../../../../entities/user.entity';
import { IsEnum, IsString, IsStrongPassword, Length } from 'class-validator';

export class CreateUserRequestDto {
  @IsString()
  @Length(6, 15)
  username: string;

  @IsString()
  @Length(2, 100)
  name: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsStrongPassword()
  password: string;
}
