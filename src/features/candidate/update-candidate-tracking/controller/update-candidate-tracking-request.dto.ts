import { IsArray, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateCandidateTrackingRequestDto {
  @IsOptional()
  @IsBoolean()
  isFullScreenExited?: boolean;

  @IsOptional()
  @IsBoolean()
  isDevToolsOpened?: boolean;

  @IsOptional()
  @IsNumber()
  tabChangeCount?: number;

  @IsOptional()
  @IsArray()
  screenCaptureImages?: Express.Multer.File[];

  @IsOptional()
  @IsArray()
  webcamCaptureImages?: Express.Multer.File[];
}
