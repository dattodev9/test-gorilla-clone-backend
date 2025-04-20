import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const exist = await this.userRepository.findOne({
      where: {
        username: this.configService.get<string>('DEFAULT_USER_USERNAME'),
      },
    });
    if (!exist) {
      const hashedPassword = await bcrypt.hash(
        this.configService.get<string>('DEFAULT_USER_PASSWORD') || '',
        10,
      );
      const defaultUser = this.userRepository.create({
        username: this.configService.get<string>('DEFAULT_USER_USERNAME'),
        password: hashedPassword,
        name: 'Admin Default',
        role: UserRole.ADMIN,
        hasChangedPassword: true,
      });
      await this.userRepository.save(defaultUser);
      console.log('Default user created');
    }
  }
}
