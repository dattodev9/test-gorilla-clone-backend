import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from 'src/entities/test.entity';
import { OneChoiceQuestion } from 'src/entities/one-choice-question.entity';
import { MultipleChoiceQuestion } from 'src/entities/multiple-choice-question.entity';

// Test Controllers
import { CreateTestController } from './create-test/controller/create-test.controller';
import { GetTestController } from './get-test/controller/get-test.controller';
import { GetTestByIdController } from './get-test-by-id/controller/get-test-by-id.controller';
import { UpdateTestController } from './update-test/controller/update-test.controller';
import { DeleteTestController } from './delete-test/controller/delete-test.controller';

// Test Command Handlers
import { CreateTestCommandHandler } from './create-test/command/create-test.command-handler';
import { GetTestCommandHandler } from './get-test/command/get-test.command-handler';
import { GetTestByIdCommandHandler } from './get-test-by-id/command/get-test-by-id.command-handler';
import { UpdateTestCommandHandler } from './update-test/command/update-test.command-handler';
import { DeleteTestCommandHandler } from './delete-test/command/delete-test.command-handler';

// One Choice Question Controllers
import { CreateOneChoiceQuestionController } from './one-choice-question/create-one-choice-question/controller/create-one-choice-question.controller';
import { GetOneChoiceQuestionByTestIdController } from './one-choice-question/get-one-choice-question-by-test-id/controller/get-one-choice-question-by-test-id.controller';
import { UpdateOneChoiceQuestionController } from './one-choice-question/update-one-choice-question/controller/update-one-choice-question.controller';
import { DeleteOneChoiceQuestionController } from './one-choice-question/delete-one-choice-question/controller/delete-one-choice-question.controller';
import { GetOneChoiceQuestionByIdController } from './one-choice-question/get-one-choice-question-by-id/controller/get-one-choice-question-by-id.controller';

// One Choice Question Command Handlers
import { CreateOneChoiceQuestionCommandHandler } from './one-choice-question/create-one-choice-question/command/create-one-choice-question.command-handler';
import { GetOneChoiceQuestionByTestIdCommandHandler } from './one-choice-question/get-one-choice-question-by-test-id/command/get-one-choice-question.command-handler';
import { UpdateOneChoiceQuestionCommandHandler } from './one-choice-question/update-one-choice-question/command/update-one-choice-question.command-handler';
import { DeleteOneChoiceQuestionCommandHandler } from './one-choice-question/delete-one-choice-question/command/delete-one-choice-question.command-handler';
import { GetOneChoiceQuestionByIdCommandHandler } from './one-choice-question/get-one-choice-question-by-id/command/get-one-choice-question.command-handler';

// Latest Order Question
import { GetLatestOrderQuestionController } from './get-latest-order-question/controller/get-latest-order-question.controller';
import { GetLatestOrderQuestionCommandHandler } from './get-latest-order-question/command/get-latest-order-question.command-handler';

// Multiple Choice Question Controllers
import { CreateMultipleChoiceQuestionController } from './multiple-choice-question/create-multiple-choice-question/controller/create-multiple-choice-question.controller';
import { DeleteMultipleChoiceQuestionController } from './multiple-choice-question/delete-multiple-choice-question/controller/delete-multiple-choice-question.controller';
import { GetMultipleChoiceQuestionByIdController } from './multiple-choice-question/get-multiple-choice-question-by-id/controller/get-multiple-choice-question-by-id.controller';
import { GetMultipleChoiceQuestionByTestIdController } from './multiple-choice-question/get-multiple-choice-question-by-test-id/controller/get-multiple-choice-question-by-test-id.controller';
import {
  CreateMultipleChoiceQuestionCommandHandler
} from './multiple-choice-question/create-multiple-choice-question/command/create-multiple-choice-question.command-handler';
import {
  GetMultipleChoiceQuestionByIdCommandHandler
} from './multiple-choice-question/get-multiple-choice-question-by-id/command/get-multiple-choice-question.command-handler';
import {
  GetMultipleChoiceQuestionByTestIdCommandHandler
} from './multiple-choice-question/get-multiple-choice-question-by-test-id/command/get-multiple-choice-question.command-handler';
import {
  UpdateMultipleChoiceQuestionCommandHandler
} from './multiple-choice-question/update-multiple-choice-question/command/update-multiple-choice-question.command-handler';
import {
  DeleteMultipleChoiceQuestionCommandHandler
} from './multiple-choice-question/delete-multiple-choice-question/command/delete-multiple-choice-question.command-handler';
import {
  UpdateMultipleChoiceQuestionController
} from './multiple-choice-question/update-multiple-choice-question/controller/update-multiple-choice-question.controller';
import { GetQuestionByIdController } from './get-question-by-test-id/controller/get-question-by-test-id.controller';
import { GetQuestionByIdCommandHandler } from './get-question-by-test-id/command/get-question-by-id.command-handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Test, OneChoiceQuestion, MultipleChoiceQuestion]),
  ],
  controllers: [
    // Test Controllers
    CreateTestController,
    GetTestController,
    GetTestByIdController,
    GetQuestionByIdController,
    UpdateTestController,
    DeleteTestController,

    // One Choice Question Controllers
    CreateOneChoiceQuestionController,
    GetOneChoiceQuestionByTestIdController,
    UpdateOneChoiceQuestionController,
    DeleteOneChoiceQuestionController,
    GetOneChoiceQuestionByIdController,

    // Latest Order Question Controller
    GetLatestOrderQuestionController,

    // Multiple Choice Question Controllers
    CreateMultipleChoiceQuestionController,
    DeleteMultipleChoiceQuestionController,
    GetMultipleChoiceQuestionByIdController,
    GetMultipleChoiceQuestionByTestIdController,
    UpdateMultipleChoiceQuestionController
  ],
  providers: [
    // Test Command Handlers
    CreateTestCommandHandler,
    GetTestCommandHandler,
    GetTestByIdCommandHandler,
    GetQuestionByIdCommandHandler,
    UpdateTestCommandHandler,
    DeleteTestCommandHandler,

    // One Choice Question Command Handlers
    CreateOneChoiceQuestionCommandHandler,
    GetOneChoiceQuestionByTestIdCommandHandler,
    UpdateOneChoiceQuestionCommandHandler,
    DeleteOneChoiceQuestionCommandHandler,
    GetOneChoiceQuestionByIdCommandHandler,

    // Latest Order Question Command Handler
    GetLatestOrderQuestionCommandHandler,

    // Multiple Choice Question Command Handler
    CreateMultipleChoiceQuestionCommandHandler,
    GetMultipleChoiceQuestionByIdCommandHandler,
    GetMultipleChoiceQuestionByTestIdCommandHandler,
    UpdateMultipleChoiceQuestionCommandHandler,
    DeleteMultipleChoiceQuestionCommandHandler
  ],
})
export class TestModule {}