import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Test, TestStatus } from "src/entities/test.entity";
import { GetTestRequestDto } from '../controller/get-test-request.dto';
import { PaginationResponseDto } from '../../../../common/pagination/pagination-response-dto';
import { AppDataSource } from "src/shared/app-data-source";
import { camelToSnakeCase } from "src/shared/camel-to-snake-case";

export type TestResponse = Test & {
    totalQuestion: string;
    totalTime: string;
}

export class GetTestCommandHandler {
    constructor(
        @InjectRepository(Test)
        private testRepository: Repository<Test>,
    ) { }

    public async execute(getTestRequestDto: GetTestRequestDto): Promise<PaginationResponseDto<Test>> {
        const {
            page = 1,
            size = 10,
            sortBy = 'createdAt',
            direction = 'desc',
            name,
            status
        } = getTestRequestDto;

        const data = await this.findAllQuestions((page - 1) * size, size, camelToSnakeCase(sortBy), direction, name, status);
        const dataLength: number = await this.getCount(name, status);

        return {
            data,
            page,
            size,
            total: dataLength,
            totalPages: Math.ceil(dataLength / size),
        };
    }

    async findAllQuestions(skip: number, take: number, sortBy: string, direction: string, name?: string, status?: TestStatus[]): Promise<TestResponse[]> {
        const conditions: string[] = [];

        if (name) {
            conditions.push(`t.name ILIKE '%${name}%'`);
        }

        if (Array.isArray(status) && status.length > 0) {
            conditions.push(`t.status IN (${status.map((s) => `'${s}'`).join(', ')})`);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const query = `
            SELECT 
                t.*,
                t.created_at as "createdAt",
                (
                    SELECT COALESCE(SUM(ocq.time), 0)
                    FROM one_choice_question ocq
                    WHERE ocq.test_id = t.id
                ) +
                (
                    SELECT COALESCE(SUM(mcq.time), 0)
                    FROM multiple_choice_question mcq
                    WHERE mcq.test_id = t.id
                ) AS "totalTime",
                (
                    SELECT COUNT(*)
                    FROM one_choice_question ocq
                    WHERE ocq.test_id = t.id
                ) +
                (
                    SELECT COUNT(*)
                    FROM multiple_choice_question mcq
                    WHERE mcq.test_id = t.id
                ) AS "totalQuestion"
            FROM test t
            ${whereClause}
            ORDER BY t.${sortBy} ${direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'}
            LIMIT ${take} OFFSET ${skip}
        `;
        return await AppDataSource.query(query);
    }

    async getCount(name?: string, status?: TestStatus[]): Promise<number> {
        const conditions: string[] = [];

        if (name) {
            conditions.push(`t.name ILIKE '%${name}%'`);
        }

        if (Array.isArray(status) && status.length > 0) {
            conditions.push(`t.status IN (${status.map((s) => `'${s}'`).join(', ')})`);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const query = `
            SELECT 
            COUNT(*)
            FROM test t
            ${whereClause}
        `;
        const result: { count: string }[] = await AppDataSource.query(query);
        return Number(result[0].count);
    }
}