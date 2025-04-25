import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assessment } from '../../entities/assessment.entity';
import { CreateCandidateCommandHandler } from './create-candidate/command/create-candidate.command-handler';
import { CreateCandidateController } from './create-candidate/controller/create-candidate.controller';
import { Candidate } from '../../entities/candidate.entity';
import { GetCandidateController } from './get-candidate/controller/get-candidate.controller';
import { GetCandidateCommandHandler } from './get-candidate/command/get-candidate.command-handler';
import { GetCandidateByIdController } from './get-candidate-by-id/controller/get-candidate-by-id.controller';
import { GetCandidateByIdCommandHandler } from './get-candidate-by-id/command/get-candidate-by-id.command-handler';
import { DeleteCandidateCommandHandler } from './delete-candidate/command/delete-candidate.command-handler';
import { DeleteCandidateController } from './delete-candidate/controller/delete-candidate.controller';
import { GetAssessmentOverviewByIdController } from './get-assessment-overview-by-id/controller/get-assessment-overview-by-id.controller';
import { GetAssessmentOverviewByIdCommandHandler } from './get-assessment-overview-by-id/command/get-assessment-overview-by-id.command-handler';
import { GetAssessmentByIdController } from './get-assessment-by-id/controller/get-assessment-by-id.controller';
import { GetAssessmentByIdCommandHandler } from './get-assessment-by-id/command/get-assessment-by-id.command-handler';
import { SubmitAssessmentController } from './submit-assessment/controller/submit-assessment.controller';
import { SubmitAssessmentCommandHandler } from './submit-assessment/command/submit-assessment.command-handler';
import { OneChoiceQuestion } from '../../entities/one-choice-question.entity';
import { MultipleChoiceQuestion } from '../../entities/multiple-choice-question.entity';
import { Test } from '../../entities/test.entity';
import { UpdateCandidateStatusCommandHandler } from './update-candidate-status/command/update-candidate-status.command-handler';
import { UpdateCandidateStatusController } from './update-candidate-status/controller/update-candidate-status.controller';
import { CodingQuestion } from '../../entities/coding-question.entity';
import { CandidateTracking } from 'src/entities/candidate-tracking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Candidate,
      CandidateTracking,
      Assessment,
      Test,
      OneChoiceQuestion,
      MultipleChoiceQuestion,
      CodingQuestion,
    ]),
  ],
  controllers: [
    CreateCandidateController,
    GetCandidateController,
    GetCandidateByIdController,
    GetAssessmentOverviewByIdController,
    GetAssessmentByIdController,
    UpdateCandidateStatusController,
    SubmitAssessmentController,
    DeleteCandidateController,
  ],
  providers: [
    CreateCandidateCommandHandler,
    GetCandidateCommandHandler,
    GetCandidateByIdCommandHandler,
    GetAssessmentOverviewByIdCommandHandler,
    GetAssessmentByIdCommandHandler,
    UpdateCandidateStatusCommandHandler,
    SubmitAssessmentCommandHandler,
    DeleteCandidateCommandHandler,
  ],
})
export class CandidateModule {}
