import { UserRole } from '../../../../entities/user.entity';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class UpdateUserRequestDto {
  @IsString()
  @IsOptional()
  @Length(2, 100)
  name?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsStrongPassword()
  @IsOptional()
  password?: string;
}
