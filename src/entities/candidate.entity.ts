import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Assessment } from './assessment.entity';
import { CandidateTracking } from './candidate-tracking.entity';

export enum CandidateStatus {
  ACTIVE = 'active',
  DONE = 'done',
  PROCESSING = 'processing',
  CANCELED = 'canceled',
}

export type DoneTests = {
  id: string;
  name: string;
  overall: number;
  time: number;
  totalTime: number;
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

  @OneToMany(() => CandidateTracking, (ct) => ct.candidate, {
    onDelete: 'CASCADE',
  })
  candidateTrackings: CandidateTracking[];
}
