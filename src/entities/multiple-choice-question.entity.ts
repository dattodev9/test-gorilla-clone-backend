import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Test } from './test.entity';
import { Choice } from './one-choice-question.entity';

@Entity()
export class MultipleChoiceQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  content: string;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  public choices: Array<Choice>;

  @Column('varchar', { array: true })
  key: string[];

  @Column()
  time: number;

  @Column()
  order: number;

  @ManyToOne(() => Test, (test) => test.multipleChoiceQuestions)
  test: Test;
}
