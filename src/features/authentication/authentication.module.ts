import { Module } from '@nestjs/common';
import { SignInController } from './sign-in/controller/sign-in.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { SignUpController } from './sign-up/command/sign-up.controller';
import { SignUpCommandHandler } from './sign-up/command/sign-up.command-handler';
import { SignInCommandHandler } from './sign-in/command/sign-in.command-handler';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  controllers: [SignInController, SignUpController],
  providers: [SignInCommandHandler, SignUpCommandHandler, JwtService],
})
export class AuthenticationModule {}
