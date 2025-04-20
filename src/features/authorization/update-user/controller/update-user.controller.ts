import {
  Body,
  Controller,
  InternalServerErrorException,
  Param,
  Patch,
} from '@nestjs/common';
import { UpdateUserCommandHandler } from '../command/update-user.command-handler';
import { UpdateUserRequestDto } from './update-user-request.dto';
import { UserNotFoundError } from '../error/user-not-found.error';
import { Serialize } from '../../../../common/serialize.interceptor';
import { User } from '../../../../entities/user.entity';

@Serialize(User)
@Controller('/authorization')
export class UpdateUserController {
  constructor(private handler: UpdateUserCommandHandler) {}

  @Patch('/user/:id')
  public async updateUser(
    @Param('id') id: string,
    @Body() request: UpdateUserRequestDto,
  ) {
    try {
      return await this.handler.execute(id, request);
    } catch (e) {
      console.error(e);

      if (e instanceof UserNotFoundError) {
        throw new UserNotFoundError('User not found!');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
