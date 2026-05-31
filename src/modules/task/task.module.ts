import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './models/task.entity';
import { TaskTypes } from './models/task-types.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TASK_SERVICE } from './constrants';
import { User } from 'modules/users/models/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskTypes, User])],
  controllers: [TaskController],
  providers: [{
    provide: TASK_SERVICE,
    useClass: TaskService
  }],
  exports: [TASK_SERVICE]
})
export class TaskModule { }
