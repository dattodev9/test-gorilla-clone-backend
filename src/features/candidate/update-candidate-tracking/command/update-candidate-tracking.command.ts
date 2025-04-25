export class UpdateCandidateTrackingCommand {
  isFullScreenExited: boolean;
  isDevToolsOpened: boolean;
  tabChangeCount: number;
  screenCaptureImages: Express.Multer.File[];
  webcamCaptureImages: Express.Multer.File[];
}
