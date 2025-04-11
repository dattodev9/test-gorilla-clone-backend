import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Test } from '../../../../entities/test.entity';
import { Repository } from 'typeorm';
import { TestNotFoundError } from '../error/test-not-found.error';

Inject();

export class DeleteTestCommandHandler {
  constructor(
    @InjectRepository(Test)
    private userRepository: Repository<Test>,
  ) {}

  public async deleteTest(id: string) {
    const existTest = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!existTest) {
      throw new TestNotFoundError();
    }

    await this.userRepository.delete({
      id: id,
    });
  }
}
