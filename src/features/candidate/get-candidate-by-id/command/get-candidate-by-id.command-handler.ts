import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from '../../../../entities/candidate.entity';
import { Repository } from 'typeorm';
import { CandidateNotFoundError } from '../error/candidate-not-found.error';
import { AppDataSource } from '../../../../shared/app-data-source';
import { CandidateTracking } from 'src/entities/candidate-tracking.entity';
import { S3Service } from 'src/shared/modules/aws-s3/s3.service';

type CandidateResponse = Candidate &
  CandidateTracking & {
    overall: string;
    totalTime: string;
  };

Inject();

export class GetCandidateByIdCommandHandler {
  constructor(
    @InjectRepository(CandidateTracking)
    private candidateTrackingRepository: Repository<CandidateTracking>,
    private s3Service: S3Service,
  ) {}

  public async execute(id: string) {
    const candidate = await this.findCandidateById(id);

    if (!candidate) {
      throw new CandidateNotFoundError();
    }

    const candidateTracking = await this.candidateTrackingRepository.findOne({
      where: {
        candidate: {
          id: candidate.id,
        },
      },
    });

    if (candidateTracking) {
      if (candidateTracking.screenCaptureImages.length > 0) {
        const processedScreenCaptureImages: string[] = [];
        for (const image of candidateTracking.screenCaptureImages) {
          const presignUrl = await this.s3Service.getFileFromBucket(image);
          processedScreenCaptureImages.push(presignUrl);
        }
        candidateTracking.screenCaptureImages = processedScreenCaptureImages;
      }

      if (candidateTracking.webcamCaptureImages.length > 0) {
        const processedWebcamCaptureImages: string[] = [];
        for (const image of candidateTracking.webcamCaptureImages) {
          const presignUrl = await this.s3Service.getFileFromBucket(image);
          processedWebcamCaptureImages.push(presignUrl);
        }
        candidateTracking.webcamCaptureImages = processedWebcamCaptureImages;
      }
    }

    return {
      ...candidate,
      candidateTracking: {
        ...(candidateTracking || {}),
      },
    };
  }

  private async findCandidateById(id: string): Promise<CandidateResponse> {
    const query = `
        SELECT c.id                                                            AS "id",
               c.name                                                          AS "name",
               c.email                                                         AS "email",
               COALESCE((SELECT AVG((value ->> 'overall')::float)
                         FROM jsonb_array_elements(c.done_tests) AS value), 0) AS "overall",
               COALESCE((SELECT SUM((value ->> 'time')::float)
                         FROM jsonb_array_elements(c.done_tests) AS value), 0) AS "totalTakeTime",
               COALESCE((SELECT SUM((value ->> 'totalTime')::float)
                         FROM jsonb_array_elements(c.done_tests) AS value), 0) AS "totalAssessmentTime",
               c.done_tests                                                    AS "doneTests",
               c.status                                                        AS "status",
               c.created_at                                                    AS "createdAt",
               COALESCE(
                       JSON_BUILD_OBJECT(
                               'id', a.id,
                               'name', a.name,
                               'jobRole', a.job_role
                       ), '{}'
               )                                                               AS "assessment"
        FROM candidate c
                 LEFT JOIN assessment a ON c.assessment_id = a.id
        WHERE c.id = '${id}'
        GROUP BY c.id, a.id, a.name, a.job_role;
    `;

    const data: CandidateResponse[] = await AppDataSource.query(query);
    return data[0];
  }
}
