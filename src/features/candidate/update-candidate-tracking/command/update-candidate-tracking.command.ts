import { ImageType } from 'src/entities/candidate-tracking.entity';

export class UpdateCandidateTrackingCommand {
  isFullScreenExited: boolean;
  isDevToolsOpened: boolean;
  tabChangeCount: number;
  screenCaptureImages: ImageType[];
  webcamCaptureImages: ImageType[];
}
