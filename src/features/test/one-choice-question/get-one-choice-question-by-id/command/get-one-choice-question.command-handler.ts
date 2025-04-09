import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OneChoiceQuestion } from '../../../../../entities/one-choice-question.entity';
import { Repository } from 'typeorm';

Inject();

export class GetOneChoiceQuestionByIdCommandHandler {
  constructor(
    @InjectRepository(OneChoiceQuestion)
    private oneChoiceQuestionRepository: Repository<OneChoiceQuestion>,
  ) {
  }

  public async execute(id: string) {
    return await this.oneChoiceQuestionRepository.findOne({
      where: {
        id: id
      },
    });
  }
}