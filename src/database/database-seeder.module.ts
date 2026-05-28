import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../modules/users/models/user.entity";
import { DatabaseSeederService } from "./database-seeder.service";
import { TaskTypes } from "modules/task/models/task-types.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, TaskTypes])],
    providers: [DatabaseSeederService],
})
export class DatabaseSeederModule { }