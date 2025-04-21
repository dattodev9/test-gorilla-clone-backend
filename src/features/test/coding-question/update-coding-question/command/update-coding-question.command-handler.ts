import { InjectRepository } from '@nestjs/typeorm';
import { CodingQuestion } from '../../../../../entities/coding-question.entity';
import { Repository } from 'typeorm';
import { UpdateCodingQuestionCommand } from './update-coding-question.command';
import { CodingQuestionNotFound } from '../error/coding-question-not-found.error';
import { removeUndefinedAttribute } from '../../../../../shared/remove-undefined-attribute';

export class UpdateCodingQuestionCommandHandler {
  constructor(
    @InjectRepository(CodingQuestion)
    private codingQuestionRepository: Repository<CodingQuestion>,
  ) {}

  public async execute(id: string, command: UpdateCodingQuestionCommand) {
    const existCodingQuestion = await this.codingQuestionRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!existCodingQuestion) {
      throw new CodingQuestionNotFound();
    }

    const updateData: Partial<CodingQuestion> =
      removeUndefinedAttribute(command);

    return await this.codingQuestionRepository.update(
      {
        id: id,
      },
      updateData,
    );
  }
}
