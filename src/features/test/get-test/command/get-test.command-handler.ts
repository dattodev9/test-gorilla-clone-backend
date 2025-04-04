import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Test } from "src/entities/test.entity";
import { Repository } from "typeorm";

Inject();

export class GetTestCommandHandler {
    constructor(
        @InjectRepository(Test)
        private testRepository: Repository<Test>,
    ) { }

    public async execute() {
        return await this.testRepository.find();
    }
}