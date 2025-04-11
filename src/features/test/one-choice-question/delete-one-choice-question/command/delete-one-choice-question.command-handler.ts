import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OneChoiceQuestion } from 'src/entities/one-choice-question.entity';
import { Repository } from 'typeorm';
import { OneChoiceQuestionNotFound } from '../error/one-choice-question-not-found.error';

Inject();

export class DeleteOneChoiceQuestionCommandHandler {
  constructor(
    @InjectRepository(OneChoiceQuestion)
    private oneChoiceQuestionRepository: Repository<OneChoiceQuestion>,
  ) {}

  public async execute(id: string) {
    const existOneChoiceQuestion =
      await this.oneChoiceQuestionRepository.findOne({
        where: {
          id: id,
        },
      });

    if (!existOneChoiceQuestion) {
      throw new OneChoiceQuestionNotFound();
    }

    return await this.oneChoiceQuestionRepository.delete({
      id: id,
    });
  }
}
