import {
  Controller,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { DeleteTestCommandHandler } from '../command/delete-test.command-handler';
import { TestNotFoundError } from '../error/test-not-found.error';

@Controller('/test')
export class DeleteTestController {
  constructor(private handler: DeleteTestCommandHandler) {}

  @Delete('/:id')
  public async deleteTest(@Param('id') id: string) {
    try {
      return await this.handler.deleteTest(id);
    } catch (error) {
      console.error(error);
      if (error instanceof TestNotFoundError) {
        throw new NotFoundException('Test not found');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
