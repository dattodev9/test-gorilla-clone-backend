import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  HR = 'hr',
  SPECIALIST = 'specialist',
  NONE = 'none',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.NONE,
  })
  role: UserRole;

  @Column({
    default: false
  })
  isFirstTimeChangePassword: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
