import { Inject } from '@nestjs/common';
import { CreateAssessmentCommand } from './create-assessment.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Assessment } from 'src/entities/assessment.entity';
import { Test, TestStatus } from 'src/entities/test.entity';
import { Repository, In } from 'typeorm';
import { TestNotFoundError } from '../error/test-not-found.error';

Inject();

export class CreateAssessmentCommandHandler {
  constructor(
    @InjectRepository(Assessment)
    private assessmentRepository: Repository<Assessment>,
    @InjectRepository(Test)
    private testRepository: Repository<Test>,
  ) {}

  public async execute(command: CreateAssessmentCommand) {
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

    const assessment = this.assessmentRepository.create({
      name: command.name,
      jobRole: command.jobRole,
      tests: tests,
    });

    return this.assessmentRepository.save(assessment);
  }
}
