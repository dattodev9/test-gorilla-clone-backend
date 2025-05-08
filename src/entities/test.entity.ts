import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { OneChoiceQuestion } from './one-choice-question.entity';
import { MultipleChoiceQuestion } from './multiple-choice-question.entity';
import { CodingQuestion } from './coding-question.entity';

export enum QuestionType {
  ONE_CHOICE_QUESTION = 'one-choice-question',
  MULTIPLE_CHOICE_QUESTION = 'multiple-choice-question',
  CODING_QUESTION = 'coding-question',
}

export enum TestStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
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

  @OneToMany(() => CodingQuestion, (codingQuestion) => codingQuestion.test, {
    onDelete: 'CASCADE',
  })
  codingQuestions: CodingQuestion[];
}
