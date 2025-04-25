import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Candidate } from './candidate.entity';

export type ImageType = {
  name: string;
  order: number;
};

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

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  public screenCaptureImages: Array<ImageType>;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  public webcamCaptureImages: Array<ImageType>;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Candidate, (candidate) => candidate.candidateTracking, {
    nullable: true,
  })
  @JoinColumn()
  candidate: Candidate;
}
