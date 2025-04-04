import { Body, Controller, InternalServerErrorException, Post } from "@nestjs/common";
import { CreateTestCommandHandler } from "../command/create-test.command-handler";
import { CreateTestRequestDto } from "./create-test-request.dto";

@Controller("/test")
export class CreateTestController{
    constructor(private readonly handler: CreateTestCommandHandler){}

    @Post()
    public async createTest(@Body() createTestRequestDto: CreateTestRequestDto){
        try{
            return await this.handler.execute(createTestRequestDto);
        } catch (error){
            console.error(error);

            throw new InternalServerErrorException("Something went wrong")
        }
    }
}