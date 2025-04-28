import { Inject } from '@nestjs/common';
import { Assessment, AssessmentStatus } from 'src/entities/assessment.entity';
import { GetAssessmentCommand } from './get-assessment.command';
import { camelToSnakeCase } from 'src/shared/camel-to-snake-case';
import { AppDataSource } from 'src/shared/app-data-source';

export type AssessmentResponse = Assessment & {
  totalCandidates: string;
  doneCandidates: string;
  otherCandidates: string;
  testCount: string;
};

Inject();

export class GetAssessmentCommandHandler {
  public async execute(command: GetAssessmentCommand) {
    const {
      page = 1,
      size = 10,
      sortBy = 'createdAt',
      direction = 'desc',
      name,
      status,
    } = command;

    const skip = (page - 1) * size;

    const data = await this.findAllAssessments(
      skip,
      size,
      sortBy,
      direction,
      name,
      status,
    );
    const dataLength: number = await this.getCount(name, status);

    return {
      data,
      page,
      size,
      total: dataLength,
      totalPages: Math.ceil(dataLength / size),
    };
  }

  async findAllAssessments(
    skip: number,
    take: number,
    sortBy: string,
    direction: string,
    name?: string,
    status?: AssessmentStatus[],
  ) {
    const ALIAS_COLUMNS = ['totalCandidates', 'testCount'];

    let orderBy: string;
    if (ALIAS_COLUMNS.includes(sortBy)) {
      orderBy = `"${sortBy}"`;
    } else {
      orderBy = `a.${camelToSnakeCase(sortBy)}`;
    }

    const conditions: string[] = [];

    if (name) {
      conditions.push(`a.name ILIKE '%${name}%'`);
    }

    if (Array.isArray(status) && status.length > 0) {
      conditions.push(
        `a.status IN (${status.map((s) => `'${s}'`).join(', ')})`,
      );
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
        SELECT a.id                                                       AS "id",
               a.name                                                     AS "name",
               a.job_role                                                 AS "jobRole",
               a.created_at                                               AS "createdAt",
               a.status                                                   AS "status",
               COUNT(DISTINCT c.id)                                       AS "totalCandidates",
               COUNT(DISTINCT CASE WHEN c.status = 'done' THEN c.id END)  AS "doneCandidates",
               COUNT(DISTINCT CASE WHEN c.status != 'done' THEN c.id END) AS "otherCandidates",
               COUNT(DISTINCT at.test_id)                                 AS "testCount"
        FROM assessment a
                 LEFT JOIN candidate c ON c.assessment_id = a.id
                 LEFT JOIN assessment_tests_test at ON at.assessment_id = a.id
            ${whereClause}
        GROUP BY a.id, a.name, a.job_role, a.created_at, a.status
        ORDER BY ${orderBy} ${direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'}
        LIMIT ${take} OFFSET ${skip}
    `;

    const result: AssessmentResponse[] = await AppDataSource.query(query);
    return result;
  }

  async getCount(name?: string, status?: AssessmentStatus[]): Promise<number> {
    const conditions: string[] = [];

    if (name) {
      conditions.push(`a.name ILIKE '%${name}%'`);
    }

    if (Array.isArray(status) && status.length > 0) {
      conditions.push(
        `a.status IN (${status.map((s) => `'${s}'`).join(', ')})`,
      );
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
        SELECT COUNT(*)
        FROM assessment a
            ${whereClause}
    `;

    const result: { count: string }[] = await AppDataSource.query(query);
    return Number(result[0].count);
  }
}
