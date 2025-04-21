import { InjectRepository } from '@nestjs/typeorm';
import { CodingQuestion } from '../../../../../entities/coding-question.entity';
import { Repository } from 'typeorm';
import { CodingQuestionNotFoundError } from '../error/coding-question-not-found.error';

export class DeleteCodingQuestionCommandHandler {
  constructor(
    @InjectRepository(CodingQuestion)
    private codingQuestionRepository: Repository<CodingQuestion>,
  ) {}

  public async execute(id: string) {
    const existCodingQuestion = await this.codingQuestionRepository.findOne({
      where: {
        id,
      },
    });

    if (!existCodingQuestion) {
      throw new CodingQuestionNotFoundError();
    }

    return await this.codingQuestionRepository.delete({
      id,
    });
  }
}
