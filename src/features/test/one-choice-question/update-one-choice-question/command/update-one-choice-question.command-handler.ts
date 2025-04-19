import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OneChoiceQuestion } from 'src/entities/one-choice-question.entity';
import { Repository } from 'typeorm';
import { UpdateOneChoiceQuestionCommand } from './update-one-choice-question.command';
import { OneChoiceQuestionNotFound } from '../error/one-choice-question-not-found.error';
import { removeUndefinedAttribute } from '../../../../../shared/remove-undefined-attribute';

Inject();

export class UpdateOneChoiceQuestionCommandHandler {
  constructor(
    @InjectRepository(OneChoiceQuestion)
    private oneChoiceQuestionRepository: Repository<OneChoiceQuestion>,
  ) {}

  public async execute(id: string, command: UpdateOneChoiceQuestionCommand) {
    const existOneChoiceQuestion =
      await this.oneChoiceQuestionRepository.findOne({
        where: {
          id: id,
        },
      });

    if (!existOneChoiceQuestion) {
      throw new OneChoiceQuestionNotFound();
    }

    const updateData: Partial<OneChoiceQuestion> =
      removeUndefinedAttribute(command);

    return await this.oneChoiceQuestionRepository.update(
      {
        id: id,
      },
      updateData,
    );
  }
}
