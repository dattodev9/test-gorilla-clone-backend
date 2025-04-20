import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { GetUserRequestDto } from './get-user-request.dto';
import { GetUserCommandHandler } from '../command/get-user.command-handler';
import { Serialize } from '../../../../common/serialize.interceptor';
import { User } from '../../../../entities/user.entity';

@Serialize(User)
@Controller('/authorization')
export class GetUserController {
  constructor(private handler: GetUserCommandHandler) {}

  @Get('/user')
  public async getUser(@Query() request: GetUserRequestDto) {
    try {
      return await this.handler.execute(request);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
