import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { ChangePasswordCommand } from "./change-password.command";
import { UserNotFoundError } from "../error/user-not-found.error";
import * as bcrypt from 'bcrypt';

Inject()

export class ChangePasswordCommandHandler {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    public async execute(command: ChangePasswordCommand) {
        console.log(command);
        const userInfo = await this.userRepository.findOne({
            where: {
                username: command.username,
            },
        });

        if (!userInfo) {
            throw new UserNotFoundError();
        }
        const hashedPassword = await this.hashPassword(command.newPassword);

        return await this.userRepository.update({
            username: command.username,
        }, {
            password: hashedPassword
        })
    }

    private async hashPassword(password: string): Promise<string> {
        const SALT_ROUND = 10;
        return await bcrypt.hash(password, SALT_ROUND);
    }
}