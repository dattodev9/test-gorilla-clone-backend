import { Inject } from '@nestjs/common';
import {
  Candidate,
  CandidateStatus,
} from '../../../../entities/candidate.entity';
import { AppDataSource } from '../../../../shared/app-data-source';
import { GetCandidateByAssessmentIdCommand } from './get-candidate-by-assessment-id.command';
import { camelToSnakeCase } from '../../../../shared/camel-to-snake-case';

Inject();

type CandidateByAssessmentId = Pick<
  Candidate,
  'id' | 'name' | 'status' | 'createdAt'
> & {
  overall: string;
};

export class GetCandidateByAssessmentIdCommandHandler {
  constructor() {}

  public async execute(
    assessmentId: string,
    command: GetCandidateByAssessmentIdCommand,
  ) {
    const {
      page = 1,
      size = 10,
      sortBy = 'createdAt',
      direction = 'desc',
      name,
      status,
      overallMin,
      overallMax,
    } = command;

    const skip = (page - 1) * size;

    const data = await this.findCandidateByAssessmentId(
      skip,
      size,
      camelToSnakeCase(sortBy),
      direction,
      assessmentId,
      name,
      status,
      overallMin,
      overallMax,
    );

    const dataLength: number = await this.getCount(
      name,
      status,
      overallMin,
      overallMax,
    );

    return {
      data,
      page,
      size,
      total: dataLength,
      totalPages: Math.ceil(dataLength / size),
    };
  }

  private async findCandidateByAssessmentId(
    skip: number,
    take: number,
    sortBy: string,
    direction: string,
    assessmentId: string,
    name?: string,
    status?: CandidateStatus[],
    overallMin?: number,
    overallMax?: number,
  ): Promise<CandidateByAssessmentId> {
    const conditions: string[] = [];

    if (name) {
      conditions.push(`c.name ILIKE '%${name}%'`);
    }

    if (Array.isArray(status) && status.length > 0) {
      conditions.push(
        `c.status IN (${status.map((s) => `'${s}'`).join(', ')})`,
      );
    }

    if (overallMin) {
      conditions.push(`(c.done_tests->>'overall')::float >= ${overallMin}`);
    }

    if (overallMax) {
      conditions.push(`(c.done_tests->>'overall')::float <= ${overallMin}`);
    }

    const whereClause =
      conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '';

    const query = `
        SELECT c.id                                                            AS "id",
               c.name                                                          AS "name",
               c.email                                                         AS "email",
               COALESCE((SELECT AVG((value ->> 'overall')::float)
                         FROM jsonb_array_elements(c.done_tests) AS value), 0) AS "overall",
               c.status                                                        AS "status",
               c.created_at                                                    AS "createdAt"
        FROM candidate c
        WHERE c.assessment_id = '${assessmentId}' ${whereClause}
        ORDER BY c.${sortBy} ${direction}
        LIMIT ${take} OFFSET ${skip}
    `;

    return await AppDataSource.query(query);
  }

  private async getCount(
    name?: string,
    status?: CandidateStatus[],
    overallMin?: number,
    overallMax?: number,
  ): Promise<number> {
    const conditions: string[] = [];

    if (name) {
      conditions.push(`c.name ILIKE '%${name}%'`);
    }

    if (Array.isArray(status) && status.length > 0) {
      conditions.push(
        `c.status IN (${status.map((s) => `'${s}'`).join(', ')})`,
      );
    }

    if (overallMin) {
      conditions.push(`(c.done_tests->>'overall')::float >= ${overallMin}`);
    }

    if (overallMax) {
      conditions.push(`(c.done_tests->>'overall')::float <= ${overallMin}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
        SELECT COUNT(*)
        FROM candidate c
            ${whereClause}
    `;

    const result: { count: string }[] = await AppDataSource.query(query);
    return Number(result[0].count);
  }
}
