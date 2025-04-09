import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Test } from "src/entities/test.entity";
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
        } = getTestRequestDto;

        const skip = (page - 1) * size;
        const take = size;

        const data = await this.findAllQuestions(skip, take, camelToSnakeCase(sortBy), direction, name);
        const dataLength: number = await this.getCount(camelToSnakeCase(sortBy), direction, name);

        return {
            data,
            page,
            size,
            total: dataLength,
            totalPages: Math.ceil(dataLength / size),
        };
    }

    async findAllQuestions(skip: number, take: number, sortBy: string, direction: string, name?: string) {
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
            ${name ? `WHERE t.name ILIKE '%${name}%'` : ''}
            ORDER BY t.${sortBy} ${direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'}
            LIMIT ${take} OFFSET ${skip}
        `;

        const result: TestResponse[] = await AppDataSource.query(query);
        return result;
    }

    async getCount(sortBy: string, direction: string, name?: string): Promise<number> {
        const query = `
            SELECT 
            COUNT(*)
            FROM test t
            ${name ? `WHERE t.name ILIKE '%${name}%'` : ''}
            GROUP BY t.${sortBy}
            ORDER BY t.${sortBy} ${direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'}
        `;

        const result: { count: string }[] = await AppDataSource.query(query);
        return Number(result[0].count);
    }
}