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
import { MultipleChoiceQuestion } from "src/entities/multiple-choice-question.entity";
import { CreateOneChoiceQuestionCommandHandler } from "./one-choice-question/create-one-choice-question/command/create-one-choice-question.command-handler";
import { CreateOneChoiceQuestionController } from "./one-choice-question/create-one-choice-question/controller/create-one-choice-question.controller";
import { DeleteOneChoiceQuestionCommandHandler } from "./one-choice-question/delete-one-choice-question/command/delete-one-choice-question.command-handler";
import { DeleteOneChoiceQuestionController } from "./one-choice-question/delete-one-choice-question/controller/delete-one-choice-question.controller";
import { GetOneChoiceQuestionByIdCommandHandler } from "./one-choice-question/get-one-choice-question-by-id/command/get-one-choice-question.command-handler";
import { GetOneChoiceQuestionByIdController } from "./one-choice-question/get-one-choice-question-by-id/controller/get-one-choice-question-by-id.controller";
import { GetOneChoiceQuestionByTestIdCommandHandler } from "./one-choice-question/get-one-choice-question-by-test-id/command/get-one-choice-question.command-handler";
import { GetOneChoiceQuestionByTestIdController } from "./one-choice-question/get-one-choice-question-by-test-id/controller/get-one-choice-question-by-test-id.controller";
import { UpdateOneChoiceQuestionCommandHandler } from "./one-choice-question/update-one-choice-question/command/update-one-choice-question.command-handler";
import { UpdateOneChoiceQuestionController } from "./one-choice-question/update-one-choice-question/controller/update-one-choice-question.controller";
import { GetLatestOrderQuestionController } from "./get-latest-order-question/controller/get-latest-order-question.controller";
import { GetLatestOrderQuestionCommandHandler } from "./get-latest-order-question/command/get-latest-order-question.command-handler";

@Module({
  imports: [TypeOrmModule.forFeature([Test, OneChoiceQuestion, MultipleChoiceQuestion]),],
  controllers: [CreateTestController, GetTestController, GetTestByIdController, UpdateTestController, DeleteTestController, CreateOneChoiceQuestionController, GetOneChoiceQuestionByTestIdController, UpdateOneChoiceQuestionController, DeleteOneChoiceQuestionController, GetOneChoiceQuestionByIdController, GetLatestOrderQuestionController],
  providers: [CreateTestCommandHandler, GetTestCommandHandler, GetTestByIdCommandHandler, UpdateTestCommandHandler, DeleteTestCommandHandler, CreateOneChoiceQuestionCommandHandler, GetOneChoiceQuestionByTestIdCommandHandler, UpdateOneChoiceQuestionCommandHandler, DeleteOneChoiceQuestionCommandHandler, GetOneChoiceQuestionByIdCommandHandler, GetLatestOrderQuestionCommandHandler],
})
export class TestModule { }