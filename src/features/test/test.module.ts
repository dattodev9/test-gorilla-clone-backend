import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Test } from "src/entities/test.entity";
import { CreateTestController } from "./create-test/controller/create-test.controller";
import { CreateTestCommandHandler } from "./create-test/command/create-test.command-handler";
import { GetTestController } from "./get-test/controller/get-test.controller";
import { GetTestCommandHandler } from "./get-test/command/get-test.command-handler";

@Module({
  imports: [TypeOrmModule.forFeature([Test])],
  controllers: [CreateTestController, GetTestController],
  providers: [CreateTestCommandHandler, GetTestCommandHandler],
})
export class TestModule {}