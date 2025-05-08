import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Test } from './test.entity';

export type NearestFailedTestCase = {
  key: number;
  input: string;
  expected: string;
  actual: string;
};

export type RunCodingQuestionResponse = {
  nearestFailedTestCase: NearestFailedTestCase | null;
  error: string;
  passed: boolean;
  testCasePassed: number;
  totalTestCase: number;
};

export type TestCase = {
  key: number;
  input: string;
  output: string;
};

@Entity()
export class CodingQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  content: string;

  @Column({ type: 'text' })
  initialCode: string;

  @Column({ type: 'text' })
  callSnippet: string;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  public testCases: Array<TestCase>;

  @Column()
  time: number;

  @Column()
  order: number;

  @ManyToOne(() => Test, (test) => test.codingQuestions)
  test: Test;
}
