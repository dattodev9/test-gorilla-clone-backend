import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

Inject();

export class GetInfoCommandHandler {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async execute(req: Request) {
    const username = req.get('username');

    const userInfo = await this.userRepository.findOne({
      select: {
        username: true,
        name: true,
        role: true,
        hasChangedPassword: true,
      },
      where: {
        username: username,
      },
    });

    if (!userInfo) {
      throw new Error('User not found');
    }

    return userInfo;
  }
}
