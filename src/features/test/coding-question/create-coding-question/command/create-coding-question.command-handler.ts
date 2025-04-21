import { InjectRepository } from '@nestjs/typeorm';
import { CodingQuestion } from '../../../../../entities/coding-question.entity';
import { Repository } from 'typeorm';
import { CreateOneChoiceQuestionCommand } from './create-coding-question.command';

export class CreateCodingQuestionCommandHandler {
  constructor(
    @InjectRepository(CodingQuestion)
    private codingQuestionRepository: Repository<CodingQuestion>,
  ) {}

  public async execute(command: CreateOneChoiceQuestionCommand) {
    await this.codingQuestionRepository.save(
      this.codingQuestionRepository.create({
        name: command.name,
        content: command.content,
        initialCode: command.initialCode,
        callSnippet: command.callSnippet,
        testCases: command.testCases.map((testCase) => {
          return {
            key: testCase.key,
            input: testCase.input,
            output: testCase.output,
          };
        }),
        time: command.time,
        order: command.order,
        test: {
          id: command.testId,
        },
      }),
    );
  }
}
