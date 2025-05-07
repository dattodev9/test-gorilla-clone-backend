import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GetOneChoiceQuestionByTestIdCommandHandler } from '../command/get-one-choice-question.command-handler';
import { OneChoiceQuestion } from 'src/entities/one-choice-question.entity';
import { Repository } from 'typeorm';

describe('GetOneChoiceQuestionByTestIdCommandHandler', () => {
  let handler: GetOneChoiceQuestionByTestIdCommandHandler;
  let repo: Repository<OneChoiceQuestion>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOneChoiceQuestionByTestIdCommandHandler,
        {
          provide: getRepositoryToken(OneChoiceQuestion),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetOneChoiceQuestionByTestIdCommandHandler>(
      GetOneChoiceQuestionByTestIdCommandHandler,
    );
    repo = module.get<Repository<OneChoiceQuestion>>(
      getRepositoryToken(OneChoiceQuestion),
    );
  });

  it('should return questions for a given testId', async () => {
    const testId = 'test-1';
    const questions = [
      { id: 'q1', order: 1, test: { id: testId } },
      { id: 'q2', order: 2, test: { id: testId } },
    ];

    (repo.find as jest.Mock).mockResolvedValue(questions);

    const result = await handler.execute(testId);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.find).toHaveBeenCalledWith({
      where: {
        test: {
          id: testId,
        },
      },
      order: {
        order: {
          direction: 'ASC',
        },
      },
    });
    expect(result).toBe(questions);
  });

  it('should return empty array if no questions found', async () => {
    const testId = 'empty-test';
    (repo.find as jest.Mock).mockResolvedValue([]);

    const result = await handler.execute(testId);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.find).toHaveBeenCalledWith({
      where: {
        test: {
          id: testId,
        },
      },
      order: {
        order: {
          direction: 'ASC',
        },
      },
    });
    expect(result).toEqual([]);
  });
});
