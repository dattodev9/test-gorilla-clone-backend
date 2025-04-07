import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from 'typeorm';
import { Test } from "src/entities/test.entity";
import { GetTestRequestDto } from '../controller/get-test-request.dto';
import { PaginationResponseDto } from '../../../../common/pagination/pagination-response-dto';

export class GetTestCommandHandler {
    constructor(
      @InjectRepository(Test)
      private testRepository: Repository<Test>,
    ) {}

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

        const [data, total] = await this.testRepository.findAndCount({
            where: name
              ? {
                  name: ILike(`%${name}%`),
              }
              : {},
            order: {
                [sortBy]: direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
            },
            skip,
            take,
        });

        return {
            data,
            page,
            size,
            total,
            totalPages: Math.ceil(total / size),
        };
    }
}
