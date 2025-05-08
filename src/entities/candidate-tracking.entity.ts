import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Candidate } from './candidate.entity';

@Entity()
export class CandidateTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isFullScreenExited: boolean;

  @Column({ default: false })
  isDevToolsOpened: boolean;

  @Column({ default: 0 })
  tabChangeCount: number;

  @Column({ default: false })
  isAllowScreenCapturePermission: boolean;

  @Column({ default: false })
  isAllowWebcamCapturePermission: boolean;

  @Column({ default: false })
  isExitedDuringAssessment: boolean;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  public screenCaptureImages: Array<string>;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  public webcamCaptureImages: Array<string>;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Candidate, (candidate) => candidate.candidateTracking, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  candidate: Candidate;
}
