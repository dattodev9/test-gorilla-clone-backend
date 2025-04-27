export class UpdateCandidateTrackingCommand {
  isFullScreenExited?: string;
  isDevToolsOpened?: string;
  tabChangeCount?: string;
  screenCaptureImages?: Express.Multer.File[];
  webcamCaptureImages?: Express.Multer.File[];
}
