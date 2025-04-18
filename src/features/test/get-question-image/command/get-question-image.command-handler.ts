import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/shared/modules/aws-s3/s3.service';

@Injectable()
export class GetQuestionImageCommandHandler {
  constructor(private readonly s3Service: S3Service) {}

  public async execute(name: string) {
    return await this.s3Service.getFileFromBucket(name);
  }
}
