import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateOneChoiceQuestionCommandHandler } from '../command/update-one-choice-question.command-handler';
import { OneChoiceQuestion } from 'src/entities/one-choice-question.entity';
import { Repository } from 'typeorm';
import { UpdateOneChoiceQuestionCommand } from '../command/update-one-choice-question.command';
import { OneChoiceQuestionNotFound } from '../error/one-choice-question-not-found.error';

jest.mock('src/shared/remove-undefined-attribute', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  removeUndefinedAttribute: jest.fn((input) => input),
}));

describe('UpdateOneChoiceQuestionCommandHandler', () => {
  let handler: UpdateOneChoiceQuestionCommandHandler;
  let repo: Repository<OneChoiceQuestion>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateOneChoiceQuestionCommandHandler,
        {
          provide: getRepositoryToken(OneChoiceQuestion),
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateOneChoiceQuestionCommandHandler>(
      UpdateOneChoiceQuestionCommandHandler,
    );
    repo = module.get<Repository<OneChoiceQuestion>>(
      getRepositoryToken(OneChoiceQuestion),
    );
  });

  it('should update a OneChoiceQuestion when found', async () => {
    const id = 'question-1';
    const command: UpdateOneChoiceQuestionCommand = {
      name: 'Updated Name',
      content: 'Updated Content',
      choices: [
        { key: 'A', value: 'Answer A' },
        { key: 'B', value: 'Answer B' },
      ],
      key: 'A',
      time: 40,
      order: 2,
      testId: 'test-1',
    };

    const existQuestion = { id, ...command };
    (repo.findOne as jest.Mock).mockResolvedValue(existQuestion);
    (repo.update as jest.Mock).mockResolvedValue({ affected: 1 });

    const result = await handler.execute(id, command);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id } });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.update).toHaveBeenCalledWith({ id }, command);
    expect(result).toEqual({ affected: 1 });
  });

  it('should throw OneChoiceQuestionNotFound if not found', async () => {
    const id = 'not-exist';
    const command: UpdateOneChoiceQuestionCommand = {
      name: 'Updated Name',
      content: 'Updated Content',
      choices: [
        { key: 'A', value: 'Answer A' },
        { key: 'B', value: 'Answer B' },
      ],
      key: 'A',
      time: 40,
      order: 2,
      testId: 'test-1',
    };

    (repo.findOne as jest.Mock).mockResolvedValue(null);

    await expect(handler.execute(id, command)).rejects.toThrow(
      OneChoiceQuestionNotFound,
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id } });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.update).not.toHaveBeenCalled();
  });
});
