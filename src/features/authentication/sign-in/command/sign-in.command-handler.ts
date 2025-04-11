import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserNotFoundError } from '../error/user-not-found.error';
import { SignInCommand } from './sign-in.command';
import { PasswordIncorrectError } from '../error/password-incorrect.error';
import { JwtService } from '../../../../shared/modules/jwt-auth/jwt.service';
import { Response } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

Inject();

export class SignInCommandHandler {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async execute(res: Response, command: SignInCommand) {
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

    const payload = { sub: userInfo.id, username: userInfo.username };

    const accessToken = await this.jwtService.generateToken(
      {
        ...payload,
        type: 'accessToken',
      },
      '15m',
    );

    const refreshToken = await this.jwtService.generateToken(
      {
        ...payload,
        type: 'refreshToken',
      },
      '7d',
    );

    await this.cacheManager.set(
      `refreshToken-${userInfo.username}`,
      refreshToken,
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    });

    return res.status(200).json({
      message: 'Sign in successful',
    });
  }

  private async validatePassword(
    requestPassword: string,
    userPassword: string,
  ) {
    return await bcrypt.compare(requestPassword, userPassword);
  }
}
