import { Module } from '@nestjs/common';
import { CreateAssessmentController } from './create-assessment/controller/create-assessment.controller';
import { CreateAssessmentCommandHandler } from './create-assessment/command/create-assessment.command-handler';
import { Assessment } from 'src/entities/assessment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from 'src/entities/test.entity';
import { Candidate } from 'src/entities/candidate.entity';
import { GetAssessmentController } from './get-assessment/controller/get-assessment.controller';
import { GetAssessmentCommandHandler } from './get-assessment/command/get-assessment.command-handler';
import { GetAssessmentByIdController } from './get-assessment-by-id/controller/get-assessment-by-id.controller';
import { GetAssessmentByIdCommandHandler } from './get-assessment-by-id/command/get-assessment-by-id.command-handler';
import { UpdateAssessmentController } from './update-assessment/controller/update-assessment.controller';
import { UpdateAssessmentCommandHandler } from './update-assessment/command/update-assessment.command-handler';
import { GetCandidateByAssessmentIdController } from './get-candidate-by-assessment-id/controller/get-candidate-by-assessment-id.controller';
import { GetCandidateByAssessmentIdCommandHandler } from './get-candidate-by-assessment-id/command/get-candidate-by-assessment-id.command-handler';
import { GetAssessmentViewByIdController } from './get-assessment-view-by-id/controller/get-assessment-view-by-id.controller';
import { GetAssessmentViewByIdCommandHandler } from './get-assessment-view-by-id/command/get-assessment-view-by-id.command-handler';

@Module({
  imports: [TypeOrmModule.forFeature([Assessment, Test, Candidate])],
  controllers: [
    CreateAssessmentController,
    GetAssessmentController,
    GetAssessmentByIdController,
    GetCandidateByAssessmentIdController,
    GetAssessmentViewByIdController,
    UpdateAssessmentController,
  ],
  providers: [
    CreateAssessmentCommandHandler,
    GetAssessmentCommandHandler,
    GetAssessmentByIdCommandHandler,
    GetCandidateByAssessmentIdCommandHandler,
    GetAssessmentViewByIdCommandHandler,
    UpdateAssessmentCommandHandler,
  ],
})
export class AssessmentModule {}
