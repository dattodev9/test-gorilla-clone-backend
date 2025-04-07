import {  Controller, Get, InternalServerErrorException, Query } from '@nestjs/common';
import { GetTestCommandHandler } from '../command/get-test.command-handler';
import { GetTestRequestDto } from './get-test-request.dto';

@Controller('/test')
export class GetTestController {
  constructor(
    private getTestCommandHandler: GetTestCommandHandler,
  ) {
  }

  @Get()
  public async getTest(
    @Query() getTestRequestDto: GetTestRequestDto
  ) {
    try {
      return await this.getTestCommandHandler.execute(getTestRequestDto);
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException(error);
    }
  }
}