import { InjectRepository } from '@nestjs/typeorm';
import { CandidateTracking } from 'src/entities/candidate-tracking.entity';
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

    let uploadedScreenImageKeys: string[] = [];
    if (
      processedCommand.screenCaptureImages &&
      processedCommand.screenCaptureImages.length
    ) {
      uploadedScreenImageKeys = await Promise.all(
        processedCommand.screenCaptureImages.map(async (file) => {
          return await this.s3Service.uploadFileToBucket(
            file,
            `${CANDIDATE_TRACKING_FOLDER}/screen-capture-images`,
          );
        }),
      );
    }

    let uploadedWebcamImageKeys: string[] = [];
    if (
      processedCommand.webcamCaptureImages &&
      processedCommand.webcamCaptureImages.length
    ) {
      uploadedWebcamImageKeys = await Promise.all(
        processedCommand.webcamCaptureImages.map(async (file) => {
          return await this.s3Service.uploadFileToBucket(
            file,
            `${CANDIDATE_TRACKING_FOLDER}/webcam-capture-images`,
          );
        }),
      );
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

    console.log(updatePayload);

    await this.candidateTrackingRepository.update(
      candidateTracking.id,
      updatePayload,
    );
  }
}
