import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateCandidateTrackingCommandHandler } from '../command/update-candidate-tracking.command-handler';
import { UpdateCandidateTrackingCommand } from '../command/update-candidate-tracking.command';
import { CandidateTrackingNotFoundError } from '../error/candidate-tracking-not-found.error';

@Controller('/candidate/:id/tracking')
export class UpdateCandidateTrackingController {
  constructor(private handler: UpdateCandidateTrackingCommandHandler) {}

  @Patch()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'screenCaptureImages', maxCount: 500 },
      { name: 'webcamCaptureImages', maxCount: 500 },
    ]),
  )
  public async updateCandidateTracking(
    @Param('id') id: string,
    @Body() command: UpdateCandidateTrackingCommand,
    @UploadedFiles()
    files: {
      screenCaptureImages?: Express.Multer.File[];
      webcamCaptureImages?: Express.Multer.File[];
    },
  ) {
    try {
      if (files.screenCaptureImages) {
        command.screenCaptureImages = files.screenCaptureImages;
      }
      if (files.webcamCaptureImages) {
        command.webcamCaptureImages = files.webcamCaptureImages;
      }

      return await this.handler.execute(id, command);
    } catch (error) {
      console.error(error);

      if (error instanceof CandidateTrackingNotFoundError) {
        throw new NotFoundException('Candidate not found!');
      }

      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
