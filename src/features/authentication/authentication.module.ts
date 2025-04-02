import { Module } from '@nestjs/common';
import { SignInController } from './sign-in/controller/sign-in.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { SignUpController } from './sign-up/controller/sign-up.controller';
import { SignUpCommandHandler } from './sign-up/command/sign-up.command-handler';
import { SignInCommandHandler } from './sign-in/command/sign-in.command-handler';
import { JwtModule } from 'src/shared/modules/jwt-auth/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  controllers: [SignInController, SignUpController],
  providers: [SignInCommandHandler, SignUpCommandHandler],
})
export class AuthenticationModule {}
