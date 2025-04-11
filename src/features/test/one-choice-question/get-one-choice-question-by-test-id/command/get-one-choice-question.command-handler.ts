import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OneChoiceQuestion } from '../../../../../entities/one-choice-question.entity';
import { Repository } from 'typeorm';

Inject();

export class GetOneChoiceQuestionByTestIdCommandHandler {
  constructor(
    @InjectRepository(OneChoiceQuestion)
    private oneChoiceQuestionRepository: Repository<OneChoiceQuestion>,
  ) {}

  public async execute(testId: string) {
    return await this.oneChoiceQuestionRepository.find({
      where: {
        test: {
          id: testId,
        },
      },
      order: {
        order: {
          direction: 'ASC',
        },
      },
    });
  }
}
