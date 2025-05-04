import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Test } from '../../../../entities/test.entity';
import { Repository } from 'typeorm';
import { TestNotFoundError } from '../error/test-not-found.error';
import { OneChoiceQuestion } from '../../../../entities/one-choice-question.entity';
import { MultipleChoiceQuestion } from '../../../../entities/multiple-choice-question.entity';
import { CodingQuestion } from '../../../../entities/coding-question.entity';

Inject();

export class DeleteTestCommandHandler {
  constructor(
    @InjectRepository(Test)
    private userRepository: Repository<Test>,
    @InjectRepository(OneChoiceQuestion)
    private oneChoiceQuestionRepository: Repository<OneChoiceQuestion>,
    @InjectRepository(MultipleChoiceQuestion)
    private multipleChoiceQuestionRepository: Repository<MultipleChoiceQuestion>,
    @InjectRepository(CodingQuestion)
    private codingQuestionRepository: Repository<CodingQuestion>,
  ) {}

  public async deleteTest(id: string) {
    const existTest = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: [
        'oneChoiceQuestions',
        'multipleChoiceQuestions',
        'codingQuestions',
      ],
    });

    if (!existTest) {
      throw new TestNotFoundError();
    }

    if (existTest.oneChoiceQuestions.length > 0) {
      await this.oneChoiceQuestionRepository.delete(
        existTest.oneChoiceQuestions.map((question) => question.id),
      );
    }

    if (existTest.multipleChoiceQuestions.length > 0) {
      await this.multipleChoiceQuestionRepository.delete(
        existTest.multipleChoiceQuestions.map((question) => question.id),
      );
    }

    if (existTest.codingQuestions.length > 0) {
      await this.codingQuestionRepository.delete(
        existTest.codingQuestions.map((question) => question.id),
      );
    }

    await this.userRepository.delete({
      id: id,
    });
  }
}
