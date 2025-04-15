import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Candidate,
  CandidateStatus,
} from '../../../../entities/candidate.entity';
import { Repository } from 'typeorm';
import { GetCandidateCommand } from './get-candidate.command';
import { camelToSnakeCase } from '../../../../shared/camel-to-snake-case';
import { AppDataSource } from '../../../../shared/app-data-source';
import { PaginationResponseDto } from '../../../../common/pagination/pagination-response-dto';

class CandidateResponse extends PaginationResponseDto<
  Candidate & {
    overall: string;
  }
> {}

Inject();

export class GetCandidateCommandHandler {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
  ) {}

  public async execute(command: GetCandidateCommand) {
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

    const data = await this.findCandidate(
      (page ?? 1) - 1,
      size,
      camelToSnakeCase(sortBy),
      direction,
      name,
      status,
      overallMin,
      overallMax,
    );

    const totalData = await this.getCount(name, status, overallMin, overallMax);

    return {
      data,
      page,
      size,
      total: totalData,
      totalPages: Math.ceil(totalData / size),
    };
  }

  private async findCandidate(
    skip: number,
    take: number,
    sortBy: string,
    direction: string,
    name?: string,
    status?: CandidateStatus[],
    overallMin?: number,
    overallMax?: number,
  ): Promise<CandidateResponse> {
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
        SELECT c.id                                                            AS "id",
               c.name                                                          AS "name",
               c.email                                                         AS "email",
               COALESCE((SELECT AVG((value ->> 'overall')::float)
                         FROM jsonb_array_elements(c.done_tests) AS value), 0) AS "overall",
               c.status                                                        AS "status",
               c.created_at                                                    AS "createdAt"
        FROM candidate c
            ${whereClause}
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
