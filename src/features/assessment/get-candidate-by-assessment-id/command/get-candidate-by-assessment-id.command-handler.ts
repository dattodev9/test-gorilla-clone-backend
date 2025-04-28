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
  email: string;
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
      sortBy,
      direction,
      assessmentId,
      name,
      status,
      overallMin,
      overallMax,
    );

    const dataLength: number = await this.getCount(
      assessmentId,
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
  ): Promise<CandidateByAssessmentId[]> {
    const conditions: string[] = [`c.assessment_id = '${assessmentId}'`];

    if (name) {
      conditions.push(`c.name ILIKE '%${name}%'`);
    }

    const ALIAS_COLUMNS = ['overall'];

    let orderBy: string;
    if (ALIAS_COLUMNS.includes(sortBy)) {
      orderBy = `"${sortBy}"`;
    } else {
      orderBy = `c.${camelToSnakeCase(sortBy)}`;
    }

    if (Array.isArray(status) && status.length > 0) {
      conditions.push(
        `c.status IN (${status.map((s) => `'${s}'`).join(', ')})`,
      );
    }

    if (overallMin !== undefined) {
      conditions.push(`COALESCE((SELECT AVG((value ->> 'overall')::float)
        FROM jsonb_array_elements(c.done_tests) AS value), 0) >= ${overallMin}`);
    }

    if (overallMax !== undefined) {
      conditions.push(`COALESCE((SELECT AVG((value ->> 'overall')::float)
        FROM jsonb_array_elements(c.done_tests) AS value), 0) <= ${overallMax}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
        SELECT c.id                                                            AS "id",
               c.name                                                          AS "name",
               c.email                                                         AS "email",
               COALESCE((SELECT AVG((value ->> 'overall')::float)
                         FROM jsonb_array_elements(c.done_tests) AS value), 0) AS "overall",
               c.status                                                        AS "status",
               c.created_at                                                    AS "createdAt"
        FROM candidate c
            ${whereClause}
        ORDER BY ${orderBy} ${direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'}
        LIMIT ${take} OFFSET ${skip}
    `;

    return await AppDataSource.query(query);
  }

  private async getCount(
    assessmentId: string,
    name?: string,
    status?: CandidateStatus[],
    overallMin?: number,
    overallMax?: number,
  ): Promise<number> {
    const conditions: string[] = [`c.assessment_id = '${assessmentId}'`];

    if (name) {
      conditions.push(`c.name ILIKE '%${name}%'`);
    }

    if (Array.isArray(status) && status.length > 0) {
      conditions.push(
        `c.status IN (${status.map((s) => `'${s}'`).join(', ')})`,
      );
    }

    if (overallMin !== undefined) {
      conditions.push(`COALESCE((SELECT AVG((value ->> 'overall')::float)
        FROM jsonb_array_elements(c.done_tests) AS value), 0) >= ${overallMin}`);
    }

    if (overallMax !== undefined) {
      conditions.push(`COALESCE((SELECT AVG((value ->> 'overall')::float)
        FROM jsonb_array_elements(c.done_tests) AS value), 0) <= ${overallMax}`);
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
