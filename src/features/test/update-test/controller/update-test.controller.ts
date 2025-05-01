import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { UpdateTestCommandHandler } from '../command/update-test.command-handler';
import { TestNotFoundError } from '../error/test-not-found.error';
import { UpdateTestRequestDto } from './update-test-request.dto';

@Controller('/test')
export class UpdateTestController {
  constructor(private handler: UpdateTestCommandHandler) {}

  @Patch(':id')
  public async updateTest(
    @Param('id') id: string,
    @Body() command: UpdateTestRequestDto,
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
