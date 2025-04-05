import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Test } from "src/entities/test.entity";
import { CreateTestController } from "./create-test/controller/create-test.controller";
import { CreateTestCommandHandler } from "./create-test/command/create-test.command-handler";
import { GetTestController } from "./get-test/controller/get-test.controller";
import { GetTestCommandHandler } from "./get-test/command/get-test.command-handler";
import { UpdateTestController } from './update-test/controller/update-test.controller';
import { UpdateTestCommandHandler } from './update-test/command/update-test.command-handler';
import { DeleteTestController } from './delete-test/controller/delete-test.controller';
import { DeleteTestCommandHandler } from './delete-test/command/delete-test.command-handler';
import { GetTestByIdController } from './get-test-by-id/controller/get-test-by-id.controller';
import { GetTestByIdCommandHandler } from './get-test-by-id/command/get-test-by-id.command-handler';

@Module({
  imports: [TypeOrmModule.forFeature([Test])],
  controllers: [CreateTestController, GetTestController, GetTestByIdController, UpdateTestController, DeleteTestController],
  providers: [CreateTestCommandHandler, GetTestCommandHandler, GetTestByIdCommandHandler, UpdateTestCommandHandler, DeleteTestCommandHandler],
})
export class TestModule {}