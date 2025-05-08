import {
  IsArray,
  IsBooleanString,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class UpdateCandidateTrackingRequestDto {
  @IsOptional()
  @IsBooleanString()
  isFullScreenExited?: string;

  @IsOptional()
  @IsBooleanString()
  isDevToolsOpened?: string;

  @IsOptional()
  @IsNumberString()
  tabChangeCount?: string;

  @IsOptional()
  @IsBooleanString()
  isAllowScreenCapturePermission?: string;

  @IsOptional()
  @IsBooleanString()
  isAllowWebcamCapturePermission?: string;

  @IsOptional()
  @IsBooleanString()
  isExitedDuringAssessment: string;

  @IsOptional()
  @IsArray()
  screenCaptureImages?: Express.Multer.File[];

  @IsOptional()
  @IsArray()
  webcamCaptureImages?: Express.Multer.File[];
}
