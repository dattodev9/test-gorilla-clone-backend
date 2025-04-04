import { Controller, Get, InternalServerErrorException } from "@nestjs/common";
import { GetTestCommandHandler } from "../command/get-test.command-handler";

@Controller("/test")
export class GetTestController {
    constructor(
        private getTestCommandHandler: GetTestCommandHandler
    ){}
    
    @Get()
    public async getTest(){
        try {
            return await this.getTestCommandHandler.execute();
        } catch (error) {
            console.error(error);

            throw new InternalServerErrorException(error);
        }
    }
}