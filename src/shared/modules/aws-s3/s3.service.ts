/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';
import slugify from 'slugify';

@Injectable()
export class S3Service {
  constructor(
    private readonly configService: ConfigService,
    private readonly s3Client: S3Client,
  ) {}

  async uploadFileToBucket(file: Express.Multer.File): Promise<string> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET');

    const timestamp = Date.now().toString();
    const randomId = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    const key = slugify(`${timestamp}-${randomId}-${file.originalname}`);

    const fileBuffer = file.buffer;
    const fileMimeType = file.mimetype;
    const fileSize = file.size;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: fileBuffer,
          ContentType: fileMimeType,
          ContentLength: fileSize,
        }),
      );
      return key;
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }

  async getFileFromBucket(key: string, expiresIn = 3600): Promise<string> {
    try {
      const bucketName = this.configService.get<string>('AWS_S3_BUCKET');

      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }
}
