import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadQuestionImageCommandHandler } from '../command/upload-question-image.command-handler';

@Controller('/question')
export class UploadQuestionImageController {
  constructor(
    private readonly uploadQuestionImageHandler: UploadQuestionImageCommandHandler,
  ) {}

  @Post('/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadQuestionImage(@UploadedFile() file: Express.Multer.File) {
    try {
      return await this.uploadQuestionImageHandler.execute(file);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
