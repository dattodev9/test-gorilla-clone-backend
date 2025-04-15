import { Module } from '@nestjs/common';
import { SignInController } from './sign-in/controller/sign-in.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { SignUpController } from './sign-up/controller/sign-up.controller';
import { SignUpCommandHandler } from './sign-up/command/sign-up.command-handler';
import { SignInCommandHandler } from './sign-in/command/sign-in.command-handler';
import { JwtModule } from 'src/shared/modules/jwt-auth/jwt.module';
import { ChangePasswordController } from './change-password/controller/change-password.controller';
import { ChangePasswordCommandHandler } from './change-password/command/change-password.command-handler';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule, ConfigModule],
  controllers: [SignInController, SignUpController, ChangePasswordController],
  providers: [
    SignInCommandHandler,
    SignUpCommandHandler,
    ChangePasswordCommandHandler,
  ],
})
export class AuthenticationModule {}
