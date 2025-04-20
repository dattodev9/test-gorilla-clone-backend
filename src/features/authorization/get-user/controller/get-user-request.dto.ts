import { PaginationRequestDto } from '../../../../common/pagination/pagination-request-dto';
import { UserRole } from '../../../../entities/user.entity';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetUserRequestDto extends PaginationRequestDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(UserRole, { each: true })
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  role?: UserRole[];
}
