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
    console.log(id);
    const isUserExisted = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    console.log(isUserExisted);

    if (!isUserExisted) {
      throw new UserNotFoundError();
    }

    return await this.userRepository.delete(id);
  }
}
