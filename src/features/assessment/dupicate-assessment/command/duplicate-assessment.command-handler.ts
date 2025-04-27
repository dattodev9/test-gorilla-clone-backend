import { InjectRepository } from '@nestjs/typeorm';
import { Assessment, AssessmentStatus } from 'src/entities/assessment.entity';
import { Repository } from 'typeorm';
import { AsssessmentNotFoundError } from '../error/assessment-not-found.error';

export class DuplicateAssessmentCommandHandler {
  constructor(
    @InjectRepository(Assessment)
    private assessmentRepository: Repository<Assessment>,
  ) {}

  public async execute(id: string) {
    const assessment = await this.assessmentRepository.findOne({
      where: {
        id,
      },
      select: {
        id: false,
      },
      relations: ['tests'],
    });

    if (!assessment) {
      throw new AsssessmentNotFoundError();
    }

    const newAssessment = this.assessmentRepository.create({
      name: `Copy of ` + assessment.name,
      jobRole: assessment.jobRole,
      status: AssessmentStatus.DRAFT,
      tests: assessment.tests,
    });

    return await this.assessmentRepository.save(newAssessment);
  }
}
