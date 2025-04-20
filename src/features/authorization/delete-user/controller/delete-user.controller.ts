import {
  Controller,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { UserNotFoundError } from '../error/user-not-found.error';
import { DeleteUserCommandHandler } from '../command/delete-user.command-handler';

@Controller('/authorization')
export class DeleteUserController {
  constructor(private handler: DeleteUserCommandHandler) {}

  @Delete('/user/:id')
  public async deleteUser(@Param('id') id: string) {
    try {
      return this.handler.execute(id);
    } catch (e) {
      console.error(e);

      if (e instanceof UserNotFoundError) {
        throw new NotFoundException('User not found!');
      }

      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
