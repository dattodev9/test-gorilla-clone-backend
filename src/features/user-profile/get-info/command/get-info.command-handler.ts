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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const username = req['user']?.username;

    const userInfo = await this.userRepository.findOne({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        hasChangedPassword: true,
      },
      where: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        username: username,
      },
    });

    if (!userInfo) {
      throw new Error('User not found');
    }

    return userInfo;
  }
}
