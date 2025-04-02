import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpCommand } from './sign-up.command';
import * as bcrypt from 'bcrypt';
import { UsernameExistedError } from '../error/username-existed.error';

Inject();

export class SignUpCommandHandler {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async execute(command: SignUpCommand): Promise<undefined> {
    const userExisted = await this.userRepository.findOne({
      where: { username: command.username },
    });

    if (userExisted) {
      throw new UsernameExistedError();
    }

    const hashedPassword = await this.hashPassword(command.password);

    await this.userRepository.save({
      username: command.username,
      password: hashedPassword,
      name: command.name,
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const SALT_ROUND = 10;
    return await bcrypt.hash(password, SALT_ROUND);
  }
}
