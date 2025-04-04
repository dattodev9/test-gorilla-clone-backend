import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Test } from "src/entities/test.entity";
import { Repository } from "typeorm";
import { CreateTestCommand } from "./create-test.command";

Inject();

export class CreateTestCommandHandler {
    constructor(
        @InjectRepository(Test)
        private testRepository: Repository<Test>,
    ){}

    public async execute(command: CreateTestCommand){
        return this.testRepository.save(command);
    }
}