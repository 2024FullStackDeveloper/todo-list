import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../../database/base/base.entity";
import { Column } from "typeorm";
import { Task } from "./task.entity";
import { User } from "modules/users/models/user.entity";

@Entity('task_types')
export class TaskTypes extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User, user => user.taskTypes, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column({ unique: true })
    name!: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ default: false })
    freeze!: boolean;

    @OneToMany(() => Task, task => task.taskType)
    tasks?: Task[];
}