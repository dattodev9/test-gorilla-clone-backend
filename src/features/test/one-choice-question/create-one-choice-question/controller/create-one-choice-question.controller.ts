import { Body, Controller, InternalServerErrorException, NotFoundException, Post } from "@nestjs/common";
import { CreateOneChoiceQuestionCommandHandler } from "../command/create-one-choice-question.command-handler";
import { CreateOneChoiceQuestionRequestDto } from "./create-one-choice-question-request.dto";
import { TestNotFoundError } from "../error/test-not-found.error";

@Controller("/one-choice-question")
export class CreateOneChoiceQuestionController {
    constructor(
        private handler: CreateOneChoiceQuestionCommandHandler
    ){}

    @Post()
    public async createQuestion(@Body() createQuestion: CreateOneChoiceQuestionRequestDto){
        try {
            await this.handler.execute(createQuestion);
        } catch (error){
            console.error(error)

            if (error instanceof TestNotFoundError){
                throw new NotFoundException(`Test with id ${createQuestion.testId} not found`);
            }

            throw new InternalServerErrorException("Something went wrong");
        }
    }
}