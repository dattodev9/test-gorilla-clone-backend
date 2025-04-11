import { Controller, Get, InternalServerErrorException, Query } from "@nestjs/common";
import { GetAssessmentCommandHandler } from "../command/get-assessment.command-handler";
import { GetAssessmentRequestDto } from "./get-assessment-request.dto";

@Controller("/assessment")
export class GetAssessmentController {
    constructor(
        private handler: GetAssessmentCommandHandler
    ){}

    @Get()
    public async getAssessment(@Query() request: GetAssessmentRequestDto){
        try{
            console.log(request);
            return await this.handler.execute(request);
        } catch(error){
            console.error(error);
            throw new InternalServerErrorException("Something went wrong");
        }
    }
}