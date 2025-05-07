import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GetOneChoiceQuestionByIdCommandHandler } from '../command/get-one-choice-question.command-handler';
import { OneChoiceQuestion } from 'src/entities/one-choice-question.entity';
import { Repository } from 'typeorm';

describe('GetOneChoiceQuestionByIdCommandHandler', () => {
  let handler: GetOneChoiceQuestionByIdCommandHandler;
  let repo: Repository<OneChoiceQuestion>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOneChoiceQuestionByIdCommandHandler,
        {
          provide: getRepositoryToken(OneChoiceQuestion),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetOneChoiceQuestionByIdCommandHandler>(
      GetOneChoiceQuestionByIdCommandHandler,
    );
    repo = module.get<Repository<OneChoiceQuestion>>(
      getRepositoryToken(OneChoiceQuestion),
    );
  });

  it('should return the OneChoiceQuestion when found', async () => {
    const id = 'question-1';
    const question = {
      id,
      name: 'Sample',
      content: 'Content',
      choices: [],
      key: 'A',
      time: 30,
      order: 1,
      testId: 'test-123',
    };
    (repo.findOne as jest.Mock).mockResolvedValue(question);

    const result = await handler.execute(id);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(result).toEqual(question);
  });

  it('should return null if OneChoiceQuestion not found', async () => {
    const id = 'not-found';
    (repo.findOne as jest.Mock).mockResolvedValue(null);

    const result = await handler.execute(id);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(result).toBeNull();
  });
});
