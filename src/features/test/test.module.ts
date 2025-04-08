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
import { OneChoiceQuestion } from "src/entities/one-choice-question.entity";
import { CreateOneChoiceQuestionCommandHandler } from './create-one-choice-question/command/create-one-choice-question.command-handler';
import { CreateOneChoiceQuestionController } from "./create-one-choice-question/controller/create-one-choice-question.controller";
import { MultipleChoiceQuestion } from "src/entities/multiple-choice-question.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Test, OneChoiceQuestion, MultipleChoiceQuestion]),],
  controllers: [CreateTestController, GetTestController, GetTestByIdController, UpdateTestController, DeleteTestController, CreateOneChoiceQuestionController],
  providers: [CreateTestCommandHandler, GetTestCommandHandler, GetTestByIdCommandHandler, UpdateTestCommandHandler, DeleteTestCommandHandler, CreateOneChoiceQuestionCommandHandler],
})
export class TestModule {}