import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';

@Entity()
export class Test {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({
        default: 0
    })
    questionCount: number;

    @Column({
        default: 0
    })
    duration: number;

    @CreateDateColumn()
    createdAt: Date;
}
