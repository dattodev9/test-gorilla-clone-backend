import { PaginationRequestDto } from '../../../../common/pagination/pagination-request-dto';
import { UserRole } from '../../../../entities/user.entity';

export class GetUserCommand extends PaginationRequestDto {
  name?: string;
  role?: UserRole[];
}
