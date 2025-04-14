import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { OneChoiceQuestion } from './one-choice-question.entity';
import { MultipleChoiceQuestion } from './multiple-choice-question.entity';

export enum TestStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

@Entity()
export class Test {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    default: TestStatus.DRAFT,
  })
  status: TestStatus;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(
    () => OneChoiceQuestion,
    (oneChoiceQuestion) => oneChoiceQuestion.test,
    {
      onDelete: 'CASCADE',
    },
  )
  oneChoiceQuestions: OneChoiceQuestion[];

  @OneToMany(
    () => MultipleChoiceQuestion,
    (multipleChoiceQuestion) => multipleChoiceQuestion.test,
    {
      onDelete: 'CASCADE',
    },
  )
  multipleChoiceQuestions: MultipleChoiceQuestion[];
}
