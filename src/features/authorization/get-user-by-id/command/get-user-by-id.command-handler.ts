import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../entities/user.entity';
import { Repository } from 'typeorm';

export class GetUserByIdCommandHandler {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async execute(id: string) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }
}
