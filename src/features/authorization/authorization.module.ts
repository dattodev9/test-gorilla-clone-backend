import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { GetUserController } from './get-user/controller/get-user.controller';
import { GetUserCommandHandler } from './get-user/command/get-user.command-handler';
import { GetUserByIdController } from './get-user-by-id/controller/get-user-by-id.controller';
import { GetUserByIdCommandHandler } from './get-user-by-id/command/get-user-by-id.command-handler';
import { UpdateUserController } from './update-user/controller/update-user.controller';
import { UpdateUserCommandHandler } from './update-user/command/update-user.command-handler';
import { CreateUserController } from './create-user/controller/create-user.controller';
import { CreateUserCommandHandler } from './create-user/command/create-user.command-handler';
import { DeleteUserController } from './delete-user/controller/delete-user.controller';
import { DeleteUserCommandHandler } from './delete-user/command/delete-user.command-handler';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [
    GetUserController,
    GetUserByIdController,
    CreateUserController,
    UpdateUserController,
    DeleteUserController,
  ],
  providers: [
    GetUserCommandHandler,
    GetUserByIdCommandHandler,
    CreateUserCommandHandler,
    UpdateUserCommandHandler,
    DeleteUserCommandHandler,
  ],
})
export class AuthorizationModule {}
