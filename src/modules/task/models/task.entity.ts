import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../../database/base/base.entity";
import { Priority } from "../enums/priority.enum";
import { User } from "../../users/models/user.entity";
import { TaskTypes } from "./task-types.entity";

@Entity('tasks', { schema: 'public' })
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
    @ManyToOne(() => TaskTypes, taskTypes => taskTypes.tasks, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'taskTypeId' })
    taskType!: TaskTypes;
    @Column()
    title!: string;
    @Column({ nullable: true })
    description?: string;
    @Column({ type: 'enum', enum: Priority, default: Priority.LOW })
    priority!: Priority;
    @Column({ default: false })
    isCompleted!: boolean;
    @Column('timestamp', { nullable: true })
    completedAt?: Date | null;
    @Column('timestamp', { nullable: true })
    dueDate?: Date;
    @ManyToOne(() => User, user => user.tasks, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: User;
}