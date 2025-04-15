import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAssessmentCommand } from './update-assessment.command';
import { Inject } from '@nestjs/common';
import { Assessment, AssessmentStatus } from 'src/entities/assessment.entity';
import { In, Repository } from 'typeorm';
import { AssessmentNotFoundError } from '../error/assessment-not-found.error';
import { Test, TestStatus } from 'src/entities/test.entity';
import { TestNotFoundError } from '../../create-assessment/error/test-not-found.error';
import { AssessmentStatusNotValidError } from '../error/assessment-status-not-valid.error';

Inject();

export class UpdateAssessmentCommandHandler {
  constructor(
    @InjectRepository(Assessment)
    private assessmentRepository: Repository<Assessment>,
    @InjectRepository(Test)
    private testRepository: Repository<Test>,
  ) {}

  public async execute(id: string, command: UpdateAssessmentCommand) {
    const existAssessment = await this.assessmentRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!existAssessment) {
      throw new AssessmentNotFoundError();
    }

    if (existAssessment.status === AssessmentStatus.ACTIVE) {
      throw new AssessmentStatusNotValidError();
    }

    if (command.name) {
      existAssessment.name = command.name;
    }

    if (command.status) {
      existAssessment.status = command.status;
    }

    if (command.jobRole) {
      existAssessment.jobRole = command.jobRole;
    }

    if (command.testIds) {
      const tests = await this.testRepository.find({
        where: {
          id: In(command.testIds),
          status: TestStatus.PUBLISHED,
        },
      });

      const foundTestIds = tests.map((test) => test.id);
      const missingTestIds = command.testIds.filter(
        (testId: string) => !foundTestIds.includes(testId),
      );

      if (missingTestIds.length > 0) {
        console.error(
          `The following test IDs are invalid: ${missingTestIds.join(', ')}`,
        );
        throw new TestNotFoundError();
      }

      existAssessment.tests = tests;

      const updatedAssessment =
        await this.assessmentRepository.save(existAssessment);

      if (!updatedAssessment) {
        throw new Error('Failed to update the assessment.');
      }
      return updatedAssessment;
    }
  }
}
