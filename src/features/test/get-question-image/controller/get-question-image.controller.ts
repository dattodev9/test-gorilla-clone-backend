import { Controller, Get, Param } from '@nestjs/common';
import { GetQuestionImageCommandHandler } from '../command/get-question-image.command-handler';

@Controller('/question')
export class GetQuestionImageController {
  constructor(private readonly command: GetQuestionImageCommandHandler) {}

  @Get('/image/:name')
  async uploadQuestionImage(@Param('name') name: string) {
    return await this.command.execute(name);
  }
}
