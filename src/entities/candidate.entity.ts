import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Assessment } from './assessment.entity';

export enum CandidateStatus {
  ACTIVE = 'active',
  DONE = 'done',
  CANCELED = 'canceled',
}

export type DoneTests = {
  id: string;
  name: string;
  overall: number;
  time: number;
};

@Entity()
export class Candidate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  public doneTests?: Array<DoneTests>;

  @Column({
    default: CandidateStatus.ACTIVE,
  })
  status: CandidateStatus;

  @Column({
    nullable: true,
  })
  takeDate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Assessment, (assessment) => assessment.candidates)
  assessment: Assessment;
}
