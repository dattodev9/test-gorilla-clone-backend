import { InjectRepository } from '@nestjs/typeorm';
import { CandidateTracking } from 'src/entities/candidate-tracking.entity';
import { Repository } from 'typeorm';
import { UpdateCandidateTrackingCommand } from './update-candidate-tracking.command';
import { CandidateTrackingNotFoundError } from '../error/candidate-tracking-not-found.error';
import { removeUndefinedAttribute } from 'src/shared/remove-undefined-attribute';
import { S3Service } from 'src/shared/modules/aws-s3/s3.service';

const CANDIDATE_TRACKING_FOLDER = 'candidate-tracking';

export class UpdateCandidateTrackingCommandHandler {
  constructor(
    @InjectRepository(CandidateTracking)
    private candidateTrackingRepository: Repository<CandidateTracking>,
    private readonly s3Service: S3Service,
  ) {}

  public async execute(id: string, command: UpdateCandidateTrackingCommand) {
    const candidateTracking = await this.candidateTrackingRepository.findOne({
      where: { candidate: { id } },
      relations: ['candidate'],
    });

    if (!candidateTracking) {
      throw new CandidateTrackingNotFoundError();
    }

    const processedCommand = removeUndefinedAttribute(command);

    const uploadFiles = async (
      files: Express.Multer.File[],
      folder: string,
    ): Promise<string[]> => {
      return Promise.all(
        files.map(async (file) => {
          try {
            return await this.s3Service.uploadFileToBucket(
              file,
              `${CANDIDATE_TRACKING_FOLDER}/${folder}`,
            );
          } catch (error) {
            console.error(`Error uploading file to ${folder}:`, error);
            return null;
          }
        }),
      ).then((results) => results.filter((key) => key !== null));
    };

    const uploadedScreenImageKeys = processedCommand.screenCaptureImages?.length
      ? await uploadFiles(
          processedCommand.screenCaptureImages,
          'screen-capture-images',
        )
      : [];

    const uploadedWebcamImageKeys = processedCommand.webcamCaptureImages?.length
      ? await uploadFiles(
          processedCommand.webcamCaptureImages,
          'webcam-capture-images',
        )
      : [];

    const updatePayload: Partial<CandidateTracking> = {
      ...(uploadedScreenImageKeys.length > 0 && {
        screenCaptureImages: [
          ...(candidateTracking.screenCaptureImages || []),
          ...uploadedScreenImageKeys,
        ],
      }),
      ...(uploadedWebcamImageKeys.length > 0 && {
        webcamCaptureImages: [
          ...(candidateTracking.webcamCaptureImages || []),
          ...uploadedWebcamImageKeys,
        ],
      }),
      ...(processedCommand.isDevToolsOpened !== undefined && {
        isDevToolsOpened: processedCommand.isDevToolsOpened === 'true',
      }),
      ...(processedCommand.isFullScreenExited !== undefined && {
        isFullScreenExited: processedCommand.isFullScreenExited === 'true',
      }),
      ...(processedCommand.tabChangeCount !== undefined && {
        tabChangeCount: Number(processedCommand.tabChangeCount),
      }),
      ...(processedCommand.isAllowWebcamCapturePermission !== undefined && {
        isAllowWebcamCapturePermission:
          processedCommand.isAllowWebcamCapturePermission === 'true',
      }),
      ...(processedCommand.isAllowScreenCapturePermission !== undefined && {
        isAllowScreenCapturePermission:
          processedCommand.isAllowScreenCapturePermission === 'true',
      }),
      ...(processedCommand.isExitedDuringAssessment !== undefined && {
        isExitedDuringAssessment:
          processedCommand.isExitedDuringAssessment === 'true',
      }),
    };

    if (Object.keys(updatePayload).length === 0) {
      console.warn('No updates to perform for candidate tracking.');
      return;
    }

    await this.candidateTrackingRepository.update(
      candidateTracking.id,
      updatePayload,
    );
  }
}
