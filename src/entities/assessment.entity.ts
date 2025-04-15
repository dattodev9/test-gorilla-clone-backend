import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Test } from './test.entity';
import { Candidate } from './candidate.entity';

export enum AssessmentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

@Entity()
export class Assessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  jobRole: string;

  @Column({
    default: AssessmentStatus.DRAFT,
  })
  status: AssessmentStatus;

  @ManyToMany(() => Test)
  @JoinTable()
  tests: Test[];

  @OneToMany(() => Candidate, (candidate) => candidate.assessment)
  candidates: Candidate[];

  @CreateDateColumn()
  createdAt: Date;
}
