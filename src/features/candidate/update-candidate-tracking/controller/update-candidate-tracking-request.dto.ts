import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ImageType } from 'src/entities/candidate-tracking.entity';

class ImageTypeAsClass {
  @IsString()
  @Min(1)
  name: string;

  @IsString()
  @Min(1)
  order: string;
}

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
  @ValidateNested({ each: true })
  @Type(() => ImageTypeAsClass)
  screenCaptureImages?: ImageType[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageTypeAsClass)
  webcamCaptureImages?: ImageType[];
}
