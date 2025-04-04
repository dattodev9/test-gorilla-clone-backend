import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { User } from "src/entities/user.entity";
import { JwtService } from "src/shared/modules/jwt-auth/jwt.service";
import { Repository } from "typeorm";
import { InvalidTokenError } from "../error/invalid-token.error";

Inject();

export class GetInfoCommandHandler {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  public async execute(req: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const accessToken = req.cookies["accessToken"];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refreshToken = req.cookies["refreshToken"];

    if (!accessToken || !refreshToken) {
      throw new InvalidTokenError();
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
    const accessPayload = await this.jwtService.verifyToken(accessToken);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
    const refreshPayload = await this.jwtService.verifyToken(refreshToken);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if(!accessPayload || !refreshPayload || !(accessPayload["username"] == refreshPayload["username"])){
      throw new InvalidTokenError();
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const username: string = accessPayload?.["username"];

    const userInfo = await this.userRepository.findOne({
      select: {
        username: true,
        name: true,
        role: true,
        isFirstTimeChangePassword: true,
      },
      where: {
        username: username,
      },
    });

    if (!userInfo) {
      throw new Error("User not found");
    }

    return userInfo;
  }
}