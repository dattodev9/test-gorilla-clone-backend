import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateCandidateTrackingCommandHandler } from '../command/update-candidate-tracking.command-handler';
import { CandidateTrackingNotFoundError } from '../error/candidate-tracking-not-found.error';
import { UpdateCandidateTrackingRequestDto } from './update-candidate-tracking-request.dto';

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
  public async patchCandidateTracking(
    @Param('id') id: string,
    @Body() request: UpdateCandidateTrackingRequestDto,
    @UploadedFiles()
    files: {
      screenCaptureImages?: Express.Multer.File[];
      webcamCaptureImages?: Express.Multer.File[];
    },
  ) {
    return this.handleUpdate(id, request, files);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'screenCaptureImages', maxCount: 500 },
      { name: 'webcamCaptureImages', maxCount: 500 },
    ]),
  )
  public async postCandidateTracking(
    @Param('id') id: string,
    @Body() request: UpdateCandidateTrackingRequestDto,
    @UploadedFiles()
    files: {
      screenCaptureImages?: Express.Multer.File[];
      webcamCaptureImages?: Express.Multer.File[];
    },
  ) {
    return this.handleUpdate(id, request, files);
  }

  private async handleUpdate(
    id: string,
    request: UpdateCandidateTrackingRequestDto,
    files: {
      screenCaptureImages?: Express.Multer.File[];
      webcamCaptureImages?: Express.Multer.File[];
    },
  ) {
    try {
      if (files.screenCaptureImages) {
        request.screenCaptureImages = files.screenCaptureImages;
      }
      if (files.webcamCaptureImages) {
        request.webcamCaptureImages = files.webcamCaptureImages;
      }

      return await this.handler.execute(id, request);
    } catch (error) {
      console.error(error);

      if (error instanceof CandidateTrackingNotFoundError) {
        throw new NotFoundException('Candidate not found!');
      }

      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
