import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assessment } from '../../entities/assessment.entity';
import { CreateCandidateCommandHandler } from './create-candidate/command/create-candidate.command-handler';
import { CreateCandidateController } from './create-candidate/controller/create-candidate.controller';
import { Candidate } from '../../entities/candidate.entity';
import { GetCandidateController } from './get-candidate/controller/get-candidate.controller';
import { GetCandidateCommandHandler } from './get-candidate/command/get-candidate.command-handler';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate, Assessment])],
  providers: [CreateCandidateCommandHandler, GetCandidateCommandHandler],
  controllers: [CreateCandidateController, GetCandidateController],
})
export class CandidateModule {}
