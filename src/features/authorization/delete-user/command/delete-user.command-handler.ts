import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../entities/user.entity';
import { Repository } from 'typeorm';
import { UserNotFoundError } from '../error/user-not-found.error';

export class DeleteUserCommandHandler {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async execute(id: string) {
    const isUserExisted = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!isUserExisted) {
      throw new UserNotFoundError();
    }

    return await this.userRepository.delete(id);
  }
}
