import { Inject } from '@nestjs/common';
import { Assessment, AssessmentStatus } from 'src/entities/assessment.entity';
import { GetAssessmentCommand } from './get-assessment.command';
import { camelToSnakeCase } from 'src/shared/camel-to-snake-case';
import { AppDataSource } from 'src/shared/app-data-source';

export type AssessmentResponse = Assessment & {
  totalCandidates: string;
  doneCandidates: string;
  otherCandidates: string;
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
      camelToSnakeCase(sortBy),
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
    const conditions: string[] = [];

    if (name) {
      conditions.push(`t.name ILIKE '%${name}%'`);
    }

    if (Array.isArray(status) && status.length > 0) {
      conditions.push(
        `t.status IN (${status.map((s) => `'${s}'`).join(', ')})`,
      );
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
                SELECT 
                    a.id AS "id",
                    a.name AS "name",
                    a.created_at AS "createdAt",
                    COUNT(c.id) AS "totalCandidates",
                    COUNT(CASE WHEN c.status = 'done' THEN 1 END) AS "doneCandidates",
                    COUNT(CASE WHEN c.status != 'done' THEN 1 END) AS "otherCandidates"
                FROM 
                    assessment a
                LEFT JOIN 
                    candidate c ON c.assessment_id = a.id
                GROUP BY 
                    a.id, a.name
                ${whereClause}
                ORDER BY a.${sortBy} ${direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'}
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
                    SELECT 
                    COUNT(*)
                    FROM assessment a
                    ${whereClause}
                `;

    const result: { count: string }[] = await AppDataSource.query(query);
    return Number(result[0].count);
  }
}
