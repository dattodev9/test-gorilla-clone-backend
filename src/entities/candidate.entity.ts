import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Assessment } from './assessment.entity';

export enum CandidateStatus {
  DRAFT = 'draft',
  INVITED = 'invited',
  DONE = 'done',
}

export type DoneTests = {
  id: string;
  name: string;
  overall: string;
};

@Entity()
export class Candidate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  jobRole: string;

  @Column()
  testLink: string;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  public doneTests: Array<DoneTests>;

  @Column({
    default: CandidateStatus.DRAFT,
  })
  status: CandidateStatus;

  @Column()
  takeDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Assessment, (assessment) => assessment.candidates)
  assessment: Assessment;
}
