import { Controller, Get, InternalServerErrorException, Param } from "@nestjs/common";
import { GetLatestOrderQuestionCommandHandler } from "../command/get-latest-order-question.command-handler";

@Controller("/test/:testId/latest-order-question")
export class GetLatestOrderQuestionController {
    constructor(private handler: GetLatestOrderQuestionCommandHandler){};

    @Get()
    public async getLatestOrderQuestion(@Param("testId") testId: string){
        try {
            return await this.handler.execute(testId);
        } catch (error){
            console.error(error);
            throw new InternalServerErrorException("Something went wrong");
        }
    }
}