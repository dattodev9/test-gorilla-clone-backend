import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserNotFoundError } from '../error/user-not-found.error';
import { SignInCommand } from './sign-in.command';
import { PasswordIncorrectError } from '../error/password-incorrect.error';
import { JwtService } from '@nestjs/jwt';

Inject();
export class SignInCommandHandler {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private jwtService: JwtService,
  ) {}

  public async execute(command: SignInCommand) {
    const userInfo = await this.userRepository.findOne({
      where: {
        username: command.username,
      },
    });

    if (!userInfo) {
      throw new UserNotFoundError();
    }

    const isTruePassword = await this.validatePassword(
      command.password,
      userInfo.password,
    );

    if (!isTruePassword) {
      throw new PasswordIncorrectError();
    }

    return true;
  }

  private async validatePassword(
    requestPassword: string,
    userPassword: string,
  ) {
    return await bcrypt.compare(requestPassword, userPassword);
  }
}
