import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateOneChoiceQuestionCommandHandler } from '../command/create-one-choice-question.command-handler';
import { OneChoiceQuestion } from 'src/entities/one-choice-question.entity';
import { Repository } from 'typeorm';
import { CreateOneChoiceQuestionCommand } from '../command/create-one-choice-question.command';

describe('CreateOneChoiceQuestionCommandHandler', () => {
  let handler: CreateOneChoiceQuestionCommandHandler;
  let repo: Repository<OneChoiceQuestion>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOneChoiceQuestionCommandHandler,
        {
          provide: getRepositoryToken(OneChoiceQuestion),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateOneChoiceQuestionCommandHandler>(
      CreateOneChoiceQuestionCommandHandler,
    );
    repo = module.get<Repository<OneChoiceQuestion>>(
      getRepositoryToken(OneChoiceQuestion),
    );
  });

  it('should create and save a OneChoiceQuestion entity from command', async () => {
    const command: CreateOneChoiceQuestionCommand = {
      name: 'Sample Question',
      content: 'What is TDD?',
      choices: [
        { key: 'A', value: 'Test Driven Development' },
        { key: 'B', value: 'Technical Design Document' },
      ],
      key: 'A',
      time: 30,
      order: 1,
      testId: 'test-123',
    };

    const createdEntity = { ...command, test: { id: command.testId } };
    (repo.create as jest.Mock).mockReturnValue(createdEntity);

    await handler.execute(command);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.create).toHaveBeenCalledWith({
      name: command.name,
      content: command.content,
      choices: [
        { key: 'A', value: 'Test Driven Development' },
        { key: 'B', value: 'Technical Design Document' },
      ],
      key: command.key,
      time: command.time,
      order: command.order,
      test: { id: command.testId },
    });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.save).toHaveBeenCalledWith(createdEntity);
  });
});
