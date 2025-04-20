import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserCommand } from './create-user.command';
import { UserExistedError } from '../error/user-existed.error';
import * as bcrypt from 'bcrypt';

export class CreateUserCommandHandler {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async execute(command: CreateUserCommand) {
    const isUserExisted = await this.userRepository.findOne({
      where: {
        username: command.username,
      },
    });

    if (isUserExisted) {
      throw new UserExistedError();
    }

    command.password = await this.hashPassword(command.password);

    return this.userRepository.save(command);
  }

  private async hashPassword(password: string): Promise<string> {
    const SALT_ROUND = 10;
    return await bcrypt.hash(password, SALT_ROUND);
  }
}
