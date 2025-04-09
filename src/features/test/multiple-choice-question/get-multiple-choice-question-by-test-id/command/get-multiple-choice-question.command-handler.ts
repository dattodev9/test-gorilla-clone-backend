import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MultipleChoiceQuestion } from '../../../../../entities/multiple-choice-question.entity';

Inject();

export class GetMultipleChoiceQuestionByTestIdCommandHandler {
  constructor(
    @InjectRepository(MultipleChoiceQuestion)
    private multipleChoiceQuestionRepository: Repository<MultipleChoiceQuestion>,
  ) {
  }

  public async execute(testId: string) {
    return await this.multipleChoiceQuestionRepository.find({
      where: {
        test: {
          id: testId,
        },
      },
      order: {
        order: {
          direction: "ASC"
        }
      }
    });
  }
}