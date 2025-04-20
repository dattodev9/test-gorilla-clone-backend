import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { UserNotFoundError } from '../error/user-not-found.error';
import { GetUserByIdCommandHandler } from '../command/get-user-by-id.command-handler';
import { Serialize } from '../../../../common/serialize.interceptor';
import { User } from '../../../../entities/user.entity';

@Serialize(User)
@Controller('/authorization')
export class GetUserByIdController {
  constructor(private handler: GetUserByIdCommandHandler) {}

  @Get('user/:id')
  public async getUserById(@Param('id') id: string) {
    try {
      return await this.handler.execute(id);
    } catch (e) {
      console.error(e);

      if (e instanceof UserNotFoundError) {
        throw new NotFoundException('User not found');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
