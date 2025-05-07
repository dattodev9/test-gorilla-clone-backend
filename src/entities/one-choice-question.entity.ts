import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Test } from './test.entity';

export type Choice = {
  key: string;
  value: string;
};

@Entity()
export class OneChoiceQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  content: string;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  public choices: Array<Choice>;

  @Column()
  key: string;

  @Column()
  time: number;

  @Column()
  order: number;

  @ManyToOne(() => Test, (test) => test.oneChoiceQuestions)
  test: Test;
}
