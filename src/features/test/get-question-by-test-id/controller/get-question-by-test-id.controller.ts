import { Controller, Get, InternalServerErrorException, Param } from "@nestjs/common";
import { GetQuestionByIdCommandHandler, Question } from "../command/get-question-by-id.command-handler";

@Controller("/test/:id/question")

export class GetQuestionByIdController {
    constructor(
        private handler: GetQuestionByIdCommandHandler
    ){}

    @Get()
    public async getQuestionById (@Param("id") id: string): Promise<Question[]>{
        try {
            return await this.handler.execute(id);
        } catch (error){
            console.error(error);

            throw new InternalServerErrorException("Something went wrong");
        }
    }
}