import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMultipleChoiceQuestionCommand } from './create-multiple-choice-question.command';
import { MultipleChoiceQuestion } from '../../../../../entities/multiple-choice-question.entity';

Inject();

export class CreateMultipleChoiceQuestionCommandHandler {
  constructor(
    @InjectRepository(MultipleChoiceQuestion)
    private multipleChoiceQuestionRepository: Repository<MultipleChoiceQuestion>,
  ) {}

  public async execute(command: CreateMultipleChoiceQuestionCommand) {
    await this.multipleChoiceQuestionRepository.save(
      this.multipleChoiceQuestionRepository.create({
        name: command.name,
        content: command.content,
        choices: command.choices.map((choice) => {
          return {
            key: choice.key,
            value: choice.value,
          };
        }),
        key: command.key,
        time: command.time,
        order: command.order,
        test: {
          id: command.testId,
        },
      }),
    );
  }
}
