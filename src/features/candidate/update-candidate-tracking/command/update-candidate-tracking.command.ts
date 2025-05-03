export class UpdateCandidateTrackingCommand {
  isFullScreenExited?: string;
  isDevToolsOpened?: string;
  tabChangeCount?: string;
  isAllowScreenCapturePermission?: string;
  isAllowWebcamCapturePermission?: string;
  screenCaptureImages?: Express.Multer.File[];
  webcamCaptureImages?: Express.Multer.File[];
}
