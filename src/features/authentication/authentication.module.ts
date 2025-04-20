import { Module } from '@nestjs/common';
import { SignInController } from './sign-in/controller/sign-in.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { SignInCommandHandler } from './sign-in/command/sign-in.command-handler';
import { JwtModule } from 'src/shared/modules/jwt-auth/jwt.module';
import { ChangePasswordController } from './change-password/controller/change-password.controller';
import { ChangePasswordCommandHandler } from './change-password/command/change-password.command-handler';
import { ConfigModule } from '@nestjs/config';
import { LogoutController } from './logout/controller/logout.controller';
import { LogoutCommandHandler } from './logout/command/logout.command-handler';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule, ConfigModule],
  controllers: [SignInController, ChangePasswordController, LogoutController],
  providers: [
    SignInCommandHandler,
    ChangePasswordCommandHandler,
    LogoutCommandHandler,
  ],
})
export class AuthenticationModule {}
