import { BadRequestException, Body, Controller, InternalServerErrorException, Post } from "@nestjs/common";
import { CreateAssessmentCommandHandler } from "../command/create-assessment.command-handler";
import { CreateAssessmentRequestDto } from "./create-assessment-request.dto";
import { TestNotFoundError } from "../error/test-not-found.error";

@Controller("/assessment")
export class CreateAssessmentController {
    constructor(
        private handler: CreateAssessmentCommandHandler
    ){}
    @Post()
    public async createAssessment(@Body() createAssessmentRequestDto: CreateAssessmentRequestDto) {
        try {
            return await this.handler.execute(createAssessmentRequestDto);
        } catch (error) {
            console.error(error);
            if (error instanceof TestNotFoundError){
                throw new BadRequestException("Test IDs are invalid");
            }

            throw new InternalServerErrorException("Something went wrong");
        }
    }
}