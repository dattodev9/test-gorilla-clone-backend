import { Controller, Get, InternalServerErrorException, Req } from "@nestjs/common";
import { GetInfoCommandHandler } from "../command/get-info.command-handler";
import { Request } from "express";

@Controller('/user-info')
export class GetInfoController {
    constructor(private readonly handler: GetInfoCommandHandler) { };

    @Get()
    public async getInfo(
        @Req() req: Request
    ) {
        try{
            return await this.handler.execute(req);
        } catch(error){
            console.error(error);

            throw new InternalServerErrorException("Something went wrong");
        }
    }
}