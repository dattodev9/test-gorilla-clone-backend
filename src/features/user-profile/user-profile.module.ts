import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { GetInfoController } from "./get-info/controller/get-info.controller";
import { GetInfoCommandHandler } from "./get-info/command/get-info.command-handler";
import { JwtModule } from "src/shared/modules/jwt-auth/jwt.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  controllers: [GetInfoController],
  providers: [GetInfoCommandHandler],
})
export class UserProfileModule {}