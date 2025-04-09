import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MultipleChoiceQuestion } from '../../../../../entities/multiple-choice-question.entity';

Inject();

export class GetMultipleChoiceQuestionByIdCommandHandler {
  constructor(
    @InjectRepository(MultipleChoiceQuestion)
    private multipleChoiceQuestionRepository: Repository<MultipleChoiceQuestion>,
  ) {
  }

  public async execute(id: string) {
    return await this.multipleChoiceQuestionRepository.findOne({
      where: {
        id: id
      },
    });
  }
}