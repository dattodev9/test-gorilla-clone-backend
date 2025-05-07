import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteOneChoiceQuestionCommandHandler } from '../command/delete-one-choice-question.command-handler';
import { OneChoiceQuestion } from 'src/entities/one-choice-question.entity';
import { Repository } from 'typeorm';
import { OneChoiceQuestionNotFound } from '../error/one-choice-question-not-found.error';

describe('DeleteOneChoiceQuestionCommandHandler', () => {
  let handler: DeleteOneChoiceQuestionCommandHandler;
  let repo: Repository<OneChoiceQuestion>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteOneChoiceQuestionCommandHandler,
        {
          provide: getRepositoryToken(OneChoiceQuestion),
          useValue: {
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<DeleteOneChoiceQuestionCommandHandler>(
      DeleteOneChoiceQuestionCommandHandler,
    );
    repo = module.get<Repository<OneChoiceQuestion>>(
      getRepositoryToken(OneChoiceQuestion),
    );
  });

  it('should delete a OneChoiceQuestion when found', async () => {
    const id = 'question-1';
    const existQuestion = { id };
    (repo.findOne as jest.Mock).mockResolvedValue(existQuestion);
    (repo.delete as jest.Mock).mockResolvedValue({ affected: 1 });
    const result = await handler.execute(id);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id } });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.delete).toHaveBeenCalledWith({ id });
    expect(result).toEqual({ affected: 1 });
  });

  it('should throw OneChoiceQuestionNotFound if not found', async () => {
    const id = 'not-exist';
    (repo.findOne as jest.Mock).mockResolvedValue(null);

    await expect(handler.execute(id)).rejects.toThrow(
      OneChoiceQuestionNotFound,
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id } });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
