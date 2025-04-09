import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MultipleChoiceQuestionNotFound } from '../error/one-choice-question-not-found.error';
import { MultipleChoiceQuestion } from '../../../../../entities/multiple-choice-question.entity';

Inject();

export class DeleteMultipleChoiceQuestionCommandHandler {
  constructor(
    @InjectRepository(MultipleChoiceQuestion)
    private multipleChoiceQuestionRepository: Repository<MultipleChoiceQuestion>,
  ) {
  }

  public async execute(id: string) {
    const existMultipleChoiceQuestion = await this.multipleChoiceQuestionRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!existMultipleChoiceQuestion) {
      throw new MultipleChoiceQuestionNotFound();
    }

    return await this.multipleChoiceQuestionRepository.delete({
      id: id,
    });
  }
}