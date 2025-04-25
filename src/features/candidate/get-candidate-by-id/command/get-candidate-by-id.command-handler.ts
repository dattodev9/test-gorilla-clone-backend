import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from '../../../../entities/candidate.entity';
import { Repository } from 'typeorm';
import { CandidateNotFoundError } from '../error/candidate-not-found.error';
import { AppDataSource } from '../../../../shared/app-data-source';

type CandidateResponse = Candidate & {
  overall: string;
  totalTime: string;
};

Inject();

export class GetCandidateByIdCommandHandler {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
  ) {}

  public async execute(id: string) {
    const candidate = await this.findCandidateById(id);

    if (!candidate) {
      throw new CandidateNotFoundError();
    }

    return candidate;
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
               )                                                               AS "assessment",
               COALESCE(
                       JSON_BUILD_OBJECT(
                                'id', ct.id,
                               'isFullScreenExited', ct.is_full_screen_exited,
                               'isDevToolsOpened', ct.is_dev_tools_opened,
                               'tabChangeCount', ct.tab_change_count,
                               'screenCaptureImages', ct.screen_capture_images,
                               'webcamCaptureImages', ct.webcam_capture_images
                       ), '{}'
               )                                                               AS "candidateTracking"                                                                              
        FROM candidate c
                 LEFT JOIN assessment a ON c.assessment_id = a.id
                 LEFT JOIN candidate_tracking ct ON ct.candidate_id = c.id
        WHERE c.id = '${id}'
        GROUP BY c.id, a.id, a.name, a.job_role, ct.id, ct.is_full_screen_exited, ct.is_dev_tools_opened, ct.tab_change_count, ct.screen_capture_images, ct.webcam_capture_images;
    `;

    const data: CandidateResponse[] = await AppDataSource.query(query);
    return data[0];
  }
}
