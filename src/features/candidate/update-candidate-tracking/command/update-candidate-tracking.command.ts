export class UpdateCandidateTrackingCommand {
  isFullScreenExited?: string;
  isDevToolsOpened?: string;
  tabChangeCount?: string;
  isAllowScreenCapturePermission?: string;
  isAllowWebcamCapturePermission?: string;
  isExitedDuringAssessment?: string;
  screenCaptureImages?: Express.Multer.File[];
  webcamCaptureImages?: Express.Multer.File[];
}
