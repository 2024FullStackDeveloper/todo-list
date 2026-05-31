import { TaskTypeResponse } from "./task-type-response.interface";
import { PromiseResult } from "../../../common/interfaces/result.interface";
import { CreateTaskTypeDto } from "../dto/create-task-type.dto";
import { UpdateTaskTypeDto } from "../dto/update-task-type.dto";
import { CreateTaskDto } from "../dto/create-task.dto";
import { TaskResponse } from "./task-response.interface";
import { UpdateTaskDto } from "../dto/update-task.dto";
import { TaskFilterDto } from "../dto/task-filter.dto";
import { PageDto } from "common/dto/page-meta.dto";

export interface ITask {
    getAllTaskTypes(userId: string): PromiseResult<TaskTypeResponse[]>;
    getTaskType(userId: string, id: string): PromiseResult<TaskTypeResponse>;
    createTaskType(userId: string, taskType: CreateTaskTypeDto): PromiseResult<TaskTypeResponse>;
    updateTaskType(userId: string, id: string, taskType: UpdateTaskTypeDto): PromiseResult<TaskTypeResponse>;
    deleteTaskType(userId: string, id: string): PromiseResult<null>;
    createTask(userId: string, task: CreateTaskDto): PromiseResult<TaskResponse>;
    deleteTask(userId: string, id: string): PromiseResult<null>;
    updateTask(userId: string, id: string, task: UpdateTaskDto): PromiseResult<TaskResponse>;
    searchTasks(userId: string, taskFilterDto: TaskFilterDto): PromiseResult<PageDto<TaskResponse>>;
    getTaskById(userId: string, id: string): PromiseResult<TaskResponse>;
}