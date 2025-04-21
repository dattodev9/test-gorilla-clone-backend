import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Test } from './test.entity';

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

  @Column()
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
