import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Test } from '../../../../entities/test.entity';
import { Repository } from 'typeorm';
import { UpdateTestCommand } from './update-test.command';
import { TestNotFoundError } from '../error/test-not-found.error';
import { createUpdateData } from '../../../../common/create-update-data';

Inject();

export class UpdateTestCommandHandler{
  constructor(
    @InjectRepository(Test)
    private testRepository: Repository<Test>
  ) {};

  public async execute(id: string, command: UpdateTestCommand) {
    const existTest = await this.testRepository.findOne({
      where: {
        id: id
      }
    });

    if (!existTest) {
      throw new TestNotFoundError();
    }

    const updateData: Partial<Test> = createUpdateData<Test>(command);

    await this.testRepository.update({
      id: id,
    }, updateData);
  }
}