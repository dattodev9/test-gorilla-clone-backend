import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Test } from '../../../../entities/test.entity';
import { Repository } from 'typeorm';
import { TestNotFoundError } from '../error/test-not-found.error';

Inject();

export class GetTestByIdCommandHandler {
  constructor(@InjectRepository(Test) private testRepository: Repository<Test>) {}

  public async getTestById(id: string){
    const existTest = await this.testRepository.findOne({
      where: {
        id: id
      }
    })

    if (!existTest){
      throw new TestNotFoundError();
    }

    return existTest;
  }
}