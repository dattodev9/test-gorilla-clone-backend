import { InjectRepository } from '@nestjs/typeorm';
import { CodingQuestion } from '../../../../../entities/coding-question.entity';
import { Repository } from 'typeorm';

export class GetCodingQuestionByIdCommandHandler {
  constructor(
    @InjectRepository(CodingQuestion)
    private codingQuestionRepository: Repository<CodingQuestion>,
  ) {}

  public async execute(id: string) {
    return await this.codingQuestionRepository.findOne({
      where: {
        id: id,
      },
    });
  }
}
