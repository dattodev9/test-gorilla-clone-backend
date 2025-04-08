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
        console.log(command);
        await this.oneChoiceQuestionRepository.save(this.oneChoiceQuestionRepository.create({
            name: command.name,
            content: command.content,
            choices: command.choices.map((choice) => {
                return ({
                    key: choice.key,
                    value: choice.value
                })
            }),
            key: command.key,
            time: command.time,
            order: command.order,
            test: {
                id: command.testId
            }
        }));
    }
}