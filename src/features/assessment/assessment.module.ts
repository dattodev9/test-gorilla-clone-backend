import { Module } from "@nestjs/common";
import { CreateAssessmentController } from "./create-assessment/controller/create-assessment.controller";
import { CreateAssessmentCommandHandler } from "./create-assessment/command/create-assessment.command-handler";
import { Assessment } from "src/entities/assessment.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Test } from "src/entities/test.entity";
import { Candidate } from "src/entities/candidate.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Assessment, Test, Candidate])],
    controllers: [CreateAssessmentController],
    providers: [CreateAssessmentCommandHandler],
})

export class AssessmentModule { };