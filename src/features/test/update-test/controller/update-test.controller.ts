import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { UpdateTestCommandHandler } from '../command/update-test.command-handler';
import { UpdateTestCommand } from '../command/update-test.command';
import { TestNotFoundError } from '../error/test-not-found.error';

@Controller('/test')
export class UpdateTestController {
  constructor(private handler: UpdateTestCommandHandler) {}

  @Patch(':id')
  public async updateTest(
    @Param('id') id: string,
    @Body() command: UpdateTestCommand,
  ) {
    try {
      return await this.handler.execute(id, command);
    } catch (error) {
      console.error(error);
      if (error instanceof TestNotFoundError) {
        throw new NotFoundException('Test not found');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
