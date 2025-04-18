import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/shared/modules/aws-s3/s3.service';

@Injectable()
export class UploadQuestionImageCommandHandler {
  constructor(private readonly s3Service: S3Service) {}

  public async execute(file: Express.Multer.File) {
    return await this.s3Service.uploadFileToBucket(file);
  }
}
