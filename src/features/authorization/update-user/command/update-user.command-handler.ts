import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserCommand } from './update-user.command';
import { UserNotFoundError } from '../error/user-not-found.error';
import { removeUndefinedAttribute } from '../../../../shared/remove-undefined-attribute';
import * as bcrypt from 'bcrypt';

export class UpdateUserCommandHandler {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async execute(id: string, command: UpdateUserCommand) {
    const existsUser = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!existsUser) {
      throw new UserNotFoundError();
    }
    const updateUserData = removeUndefinedAttribute(command);

    if (updateUserData.password) {
      updateUserData.password = await this.hashPassword(
        updateUserData.password,
      );
    }

    return await this.userRepository.save({
      ...existsUser,
      ...updateUserData,
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const SALT_ROUND = 10;
    return await bcrypt.hash(password, SALT_ROUND);
  }
}
