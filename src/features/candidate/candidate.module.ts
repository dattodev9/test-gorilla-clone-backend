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

@Module({
  imports: [TypeOrmModule.forFeature([Candidate, Assessment])],
  providers: [
    CreateCandidateCommandHandler,
    GetCandidateCommandHandler,
    GetCandidateByIdCommandHandler,
    DeleteCandidateCommandHandler,
  ],
  controllers: [
    CreateCandidateController,
    GetCandidateController,
    GetCandidateByIdController,
    DeleteCandidateController,
  ],
})
export class CandidateModule {}
