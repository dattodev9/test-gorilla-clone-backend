import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OneChoiceQuestion } from "src/entities/one-choice-question.entity";
import { Repository } from "typeorm";
import { CreateOneChoiceQuestionCommand } from "./create-one-choice-question.command";

Inject();

export class CreateOneChoiceQuestionCommandHandler {
    constructor(
        @InjectRepository(OneChoiceQuestion)
        private oneChoiceQuestionRepository: Repository<OneChoiceQuestion>
    ) { }

    public async execute(command: CreateOneChoiceQuestionCommand) {
        await this.oneChoiceQuestionRepository.save(command);
    }   
}