import { Body, Controller, HttpCode, InternalServerErrorException, NotFoundException, Post } from "@nestjs/common";
import { ChangePasswordCommandHandler } from "../command/change-password.command-handler";
import { ChangePasswordRequestDto } from "./change-password-request.dto";
import { UserNotFoundError } from "../error/user-not-found.error";

@Controller('change-password')
export class ChangePasswordController {
    constructor(private readonly handler: ChangePasswordCommandHandler) { }

    @Post()
    @HttpCode(204)
    public async changePassword(
        @Body() changePasswordRequestDto: ChangePasswordRequestDto
    ) {
        try {
            return await this.handler.execute(changePasswordRequestDto);
        } catch (error) {
            console.log(error);

            if (error instanceof UserNotFoundError) {
                throw new NotFoundException('User not found');
            }

            throw new InternalServerErrorException("Something went wrong");
        }
    }
}