import { Controller, Get, InternalServerErrorException, NotFoundException, Param } from "@nestjs/common";
import { GetAssessmentByIdCommandHandler } from "../command/get-assessment-by-id.command-handler";
import { AssessmentNotFoundError } from "../../update-assessment/error/assessment-not-found.error";

@Controller("/assessment")
export class GetAssessmentByIdController {
    constructor(
        private handler: GetAssessmentByIdCommandHandler
    ){}

    @Get(":id")
    public async getAssessmentById (@Param("id") id: string){
        try{
            return await this.handler.execute(id);
        } catch(error) {
            console.error(error);
            if(error instanceof AssessmentNotFoundError){
                throw new NotFoundException("Assessment not found");
            }

            throw new InternalServerErrorException("Something went wrong");
        }
    }
}