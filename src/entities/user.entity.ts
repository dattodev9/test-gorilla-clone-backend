import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

export enum UserRole {
  ADMIN = 'admin',
  HR = 'hr',
  SPECIALIST = 'specialist',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column({ unique: true })
  @Expose()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  @Expose()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  @Expose()
  role: UserRole;

  @Column({
    default: false,
  })
  hasChangedPassword: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
