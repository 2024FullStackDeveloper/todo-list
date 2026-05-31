import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../../database/base/base.entity";
import { Task } from "../../task/models/task.entity";
import { LowercaseTransformer } from "database/transformers/lower.transformer";
import { TaskTypes } from "modules/task/models/task-types.entity";


@Entity('users', { schema: 'public' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({ unique: true, nullable: false, transformer: LowercaseTransformer })
    email!: string;

    @Column()
    hashedPassword!: string;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ nullable: true })
    otpExpiresAt?: Date;

    @Column({ nullable: true })
    otp?: string;

    @Column('timestamp', { nullable: true })
    loginAt?: Date;

    @OneToMany(() => Task, task => task.user, { onDelete: "NO ACTION" })
    tasks?: Task[];

    @OneToMany(() => TaskTypes, taskTypes => taskTypes.user, { onDelete: "NO ACTION" })
    taskTypes?: TaskTypes[];
}