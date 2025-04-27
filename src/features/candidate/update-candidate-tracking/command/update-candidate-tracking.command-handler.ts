import { InjectRepository } from '@nestjs/typeorm';
import {
  CandidateTracking,
  ImageType,
} from 'src/entities/candidate-tracking.entity';
import { Repository } from 'typeorm';
import { UpdateCandidateTrackingCommand } from './update-candidate-tracking.command';
import { CandidateTrackingNotFoundError } from '../error/candidate-tracking-not-found.error';
import { removeUndefinedAttribute } from 'src/shared/remove-undefined-attribute';
import { S3Service } from 'src/shared/modules/aws-s3/s3.service';

const CANDIDATE_TRACKING_FOLDER = '/candidate-tracking';

export class UpdateCandidateTrackingCommandHandler {
  constructor(
    @InjectRepository(CandidateTracking)
    private candidateTrackingRepository: Repository<CandidateTracking>,
    private readonly s3Service: S3Service,
  ) {}

  public async execute(id: string, command: UpdateCandidateTrackingCommand) {
    const candidateTracking = await this.candidateTrackingRepository.findOne({
      where: {
        candidate: {
          id,
        },
      },
      relations: ['candidate'],
    });

    if (!candidateTracking) {
      throw new CandidateTrackingNotFoundError();
    }

    const processedCommand = removeUndefinedAttribute(command);

    const uploadedScreenImageKeys: ImageType[] = [];
    const uploadedWebcamImageKeys: ImageType[] = [];

    if (processedCommand.screenCaptureImages) {
      for (const file of processedCommand.screenCaptureImages) {
        const key = await this.s3Service.uploadFileToBucket(
          file,
          `${CANDIDATE_TRACKING_FOLDER}/screen-capture-images`,
        );
        uploadedScreenImageKeys.push({
          name: key,
          order: uploadedScreenImageKeys.length + 1,
        });
      }
    }

    if (processedCommand.webcamCaptureImages) {
      for (const file of processedCommand.webcamCaptureImages) {
        const key = await this.s3Service.uploadFileToBucket(
          file,
          `${CANDIDATE_TRACKING_FOLDER}/webcam-capture-images`,
        );
        uploadedWebcamImageKeys.push({
          name: key,
          order: uploadedWebcamImageKeys.length + 1,
        });
      }
    }

    const updatePayload: Partial<CandidateTracking> = {
      screenCaptureImages: [
        ...(candidateTracking.screenCaptureImages || []),
        ...uploadedScreenImageKeys,
      ],
      webcamCaptureImages: [
        ...(candidateTracking.webcamCaptureImages || []),
        ...uploadedWebcamImageKeys,
      ],
    };

    if (processedCommand.isDevToolsOpened !== undefined) {
      updatePayload.isDevToolsOpened =
        processedCommand.isDevToolsOpened === 'true';
    }
    if (processedCommand.isFullScreenExited !== undefined) {
      updatePayload.isFullScreenExited =
        processedCommand.isFullScreenExited === 'true';
    }
    if (processedCommand.tabChangeCount !== undefined) {
      updatePayload.tabChangeCount = Number(processedCommand.tabChangeCount);
    }

    await this.candidateTrackingRepository.update(
      candidateTracking.id,
      updatePayload,
    );
  }
}
