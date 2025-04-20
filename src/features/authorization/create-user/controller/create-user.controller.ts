import { Serialize } from '../../../../common/serialize.interceptor';
import { User } from '../../../../entities/user.entity';
import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { CreateUserCommandHandler } from '../command/create-user.command-handler';
import { CreateUserRequestDto } from './create-user-request.dto';
import { UserExistedError } from '../error/user-existed.error';

@Serialize(User)
@Controller('/authorization')
export class CreateUserController {
  constructor(private handler: CreateUserCommandHandler) {}

  @Post('/user')
  public async createUser(@Body() request: CreateUserRequestDto) {
    try {
      return await this.handler.execute(request);
    } catch (e) {
      console.error(e);

      if (e instanceof UserExistedError) {
        throw new BadRequestException('User with this username existed');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
