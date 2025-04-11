import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { TestNotFoundError } from '../error/test-not-found.error';
import { GetTestByIdCommandHandler } from '../command/get-test-by-id.command-handler';

@Controller('/test')
export class GetTestByIdController {
  constructor(private handler: GetTestByIdCommandHandler) {}
  @Get(':id')
  public async getTestById(@Param('id') id: string) {
    try {
      return await this.handler.execute(id);
    } catch (error) {
      console.error(error);
      if (error instanceof TestNotFoundError) {
        throw new NotFoundException('Test not found');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
