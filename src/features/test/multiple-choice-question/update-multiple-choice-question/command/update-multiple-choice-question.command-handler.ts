import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateMultipleChoiceQuestionCommand } from './update-multiple-choice-question.command';
import { removeUndefinedAttribute } from '../../../../../common/remove-undefined-attribute';
import { OneChoiceQuestionNotFound } from '../error/one-choice-question-not-found.error';
import { MultipleChoiceQuestion } from '../../../../../entities/multiple-choice-question.entity';

Inject();

export class UpdateMultipleChoiceQuestionCommandHandler {
  constructor(
    @InjectRepository(MultipleChoiceQuestion)
    private multipleChoiceQuestionRepository: Repository<MultipleChoiceQuestion>,
  ) {
  }

  public async execute(id: string, command: UpdateMultipleChoiceQuestionCommand) {
    const existOneChoiceQuestion = await this.multipleChoiceQuestionRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!existOneChoiceQuestion) {
      throw new OneChoiceQuestionNotFound();
    }

    const updateData: Partial<MultipleChoiceQuestion> = removeUndefinedAttribute(command);

    return await this.multipleChoiceQuestionRepository.update({
      id: id,
    }, updateData);
  }
}