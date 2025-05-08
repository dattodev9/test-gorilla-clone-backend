import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { In, Repository, FindOptionsWhere, ILike } from 'typeorm';
import { GetUserCommand } from './get-user.command';
import { PaginationResponseDto } from 'src/common/pagination/pagination-response-dto';

export class GetUserCommandHandler {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async execute(
    command: GetUserCommand,
  ): Promise<PaginationResponseDto<User>> {
    const {
      page = 1,
      size = 10,
      sortBy = 'createdAt',
      direction = 'desc',
      name,
      role,
    } = command;

    const whereClause: FindOptionsWhere<User> = {};

    if (name) {
      whereClause.name = ILike(`%${name}%`);
    }

    if (role) {
      whereClause.role = Array.isArray(role) ? In(role) : In([role]);
    }

    const [users, total] = await this.userRepository.findAndCount({
      where: whereClause,
      take: size,
      skip: (page - 1) * size,
      order: {
        [sortBy]: direction,
      },
    });

    return {
      data: users,
      page: page,
      size: size,
      total: total,
      totalPages: Math.ceil(total / size),
    };
  }
}
