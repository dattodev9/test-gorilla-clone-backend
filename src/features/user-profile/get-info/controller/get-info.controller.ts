import { BadRequestException, Controller, Get, InternalServerErrorException, Req } from "@nestjs/common";
import { GetInfoCommandHandler } from "../command/get-info.command-handler";
import { Request } from "express";
import { InvalidTokenError } from "../error/invalid-token.error";

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

            if(error instanceof InvalidTokenError){
                throw new BadRequestException("Token is invalid");
            }

            throw new InternalServerErrorException("Something went wrong");
        }
    }
}