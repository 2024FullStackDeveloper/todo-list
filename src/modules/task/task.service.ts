import { Injectable } from "@nestjs/common";
import { ITask } from "./interfaces/task.interface";
import { PromiseResult } from "../../common/interfaces/result.interface";
import { TaskTypeResponse } from "./interfaces/task-type-response.interface";
import { CreateTaskTypeDto } from "./dto/create-task-type.dto";
import { UpdateTaskTypeDto } from "./dto/update-task-type.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskTypes } from "./models/task-types.entity";
import { ILike, Repository } from "typeorm";
import { ResultService } from "common/services/result.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskResponse } from "./interfaces/task-response.interface";
import { Task } from "./models/task.entity";
import { User } from "modules/users/models/user.entity";
import { handleDoneBy } from "common/utils/user-stuff";
import { PageDto } from "common/dto/page-meta.dto";
import { TaskFilterDto } from "./dto/task-filter.dto";
import { paginate } from "common/utils/query-builder.util";

@Injectable()
export class TaskService implements ITask {
    constructor(
        @InjectRepository(TaskTypes) private readonly taskTypeRepository: Repository<TaskTypes>
        , @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(User) private readonly userRepository: Repository<User>) { }

    async getTaskById(userId: string, id: string): PromiseResult<TaskResponse> {
        const task = await this.taskRepository.findOne({
            where: { id, user: { id: userId } },
            relations: {
                taskType: true,
                user: true
            }
        });
        if (!task) {
            return ResultService.notFound<TaskResponse>('errors.task.notFound');
        }
        return ResultService.success({
            id: task.id,
            taskType: {
                id: task.taskType.id,
                name: task.taskType.name,
            },
            title: task.title,
            description: task.description || null,
            priority: task.priority,
            dueDate: task.dueDate || null,
            isCompleted: task.isCompleted,
            completedAt: task.completedAt || null,
            doneBy: handleDoneBy(task.user, userId),
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
        });
    }
    async searchTasks(userId: string, taskFilterDto: TaskFilterDto): PromiseResult<PageDto<TaskResponse>> {
        const taskBuilder = this.taskRepository.createQueryBuilder("task")
            .innerJoinAndSelect("task.user", "user")
            .innerJoinAndSelect("task.taskType", "taskType")
            .where("task.user.id = :userId", { userId });

        const paginationResult = await paginate(taskBuilder, taskFilterDto, { searchFields: ['title', 'description'], });
        const tasksResponse: TaskResponse[] = paginationResult.data.map((task) => ({
            id: task.id,
            taskType: {
                id: task.taskType.id,
                name: task.taskType.name,
            },
            title: task.title,
            description: task.description || null,
            priority: task.priority,
            dueDate: task.dueDate || null,
            isCompleted: task.isCompleted,
            completedAt: task.completedAt || null,
            doneBy: handleDoneBy(task.user, userId),
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
        }));

        return ResultService.success(new PageDto(tasksResponse, paginationResult.meta));

    }
    async createTask(userId: string, task: CreateTaskDto): PromiseResult<TaskResponse> {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });

        if (!user) {
            return ResultService.notFound<TaskResponse>('errors.user.notFound');
        }

        const taskTypeResult = await this.taskTypeRepository.findOne({
            where: { id: task.taskType }
        });

        if (!taskTypeResult) {
            return ResultService.notFound<TaskResponse>('errors.task.taskTypes.notFound');
        }

        const newTask = await this.taskRepository.create({
            taskType: taskTypeResult,
            title: task.title,
            description: task?.description || undefined,
            priority: task.priority,
            dueDate: task?.dueDate || new Date(),
            user: user,
        });
        await this.taskRepository.save(newTask);
        return ResultService.created<TaskResponse>({
            id: newTask.id,
            taskType: {
                id: taskTypeResult.id,
                name: taskTypeResult.name,
            },
            title: newTask.title,
            description: newTask.description || null,
            priority: newTask.priority,
            dueDate: newTask.dueDate || null,
            isCompleted: newTask.isCompleted,
            completedAt: newTask.completedAt || null,
            doneBy: handleDoneBy(user, userId),
            createdAt: newTask.createdAt,
            updatedAt: newTask.updatedAt,
        }, 'messages.tasks.created');
    }
    async deleteTask(userId: string, id: string): PromiseResult<null> {
        const task = await this.taskRepository.findOne({
            where: { id, user: { id: userId } },
            relations: {
                user: true
            }
        });
        if (!task) {
            return ResultService.notFound<null>('errors.task.notFound');
        }

        await this.taskRepository.remove(task);
        return ResultService.deleted(null, 'messages.tasks.deleted');
    }
    async updateTask(userId: string, id: string, task: UpdateTaskDto): PromiseResult<TaskResponse> {
        const taskResult = await this.taskRepository.findOne({
            where: { id, user: { id: userId } },
            relations: {
                taskType: true,
                user: true
            }
        });

        if (!taskResult) {
            return ResultService.notFound<TaskResponse>('errors.task.notFound');
        }


        if (task.taskType) {
            const taskTypeResult = await this.taskTypeRepository.findOne({
                where: { id: task.taskType }
            });
            taskResult.taskType = taskTypeResult!;
        }
        taskResult.title = task.title || taskResult.title;
        taskResult.description = task.description || taskResult.description;
        taskResult.priority = task.priority || taskResult.priority;
        taskResult.dueDate = task.dueDate || taskResult.dueDate;
        taskResult.isCompleted = task.isCompleted;

        if (!taskResult.completedAt && task.isCompleted) {
            taskResult.completedAt = new Date();
        } else if (!task.isCompleted) {
            taskResult.completedAt = null;
        }

        const updatedTask = await this.taskRepository.save(taskResult);

        return ResultService.updated<TaskResponse>({
            id: updatedTask.id,
            taskType: {
                id: updatedTask.taskType.id,
                name: updatedTask?.taskType?.name,
            },
            title: updatedTask.title,
            description: updatedTask.description || null,
            priority: updatedTask.priority,
            dueDate: updatedTask.dueDate || null,
            isCompleted: updatedTask.isCompleted,
            completedAt: updatedTask.completedAt || null,
            doneBy: handleDoneBy(updatedTask?.user!, userId),
            createdAt: updatedTask.createdAt,
            updatedAt: updatedTask.updatedAt,
        }, 'messages.tasks.updated');
    }
    async getTaskType(userId: string, id: string): PromiseResult<TaskTypeResponse> {
        const taskType = await this.taskTypeRepository.findOne({
            where: { id, user: { id: userId } },
            select: { id: true, name: true, description: true, isActive: true, createdAt: true, updatedAt: true }
        });

        if (!taskType) {
            return ResultService.notFound<TaskTypeResponse>('errors.task.taskTypes.notFound');
        }
        return ResultService.success<TaskTypeResponse>(taskType as TaskTypeResponse);
    }
    async getAllTaskTypes(userId: string): PromiseResult<TaskTypeResponse[]> {
        const taskTypes = await this.taskTypeRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'ASC' },
            select: { id: true, name: true, description: true, isActive: true, createdAt: true, updatedAt: true }
        });
        return ResultService.success<TaskTypeResponse[]>(taskTypes as TaskTypeResponse[] || []);
    }
    async createTaskType(userId: string, taskType: CreateTaskTypeDto): PromiseResult<TaskTypeResponse> {
        const taskTypeResult = await this.taskTypeRepository.findOne({
            where: { user: { id: userId }, name: ILike(`${taskType.name.trim()}`) }
        });

        if (taskTypeResult) {
            return ResultService.badRequest<TaskTypeResponse>('errors.task.taskTypes.alreadyExists');
        }
        const newTaskType = await this.taskTypeRepository.create({
            name: taskType.name.trim(),
            description: taskType?.description?.trim() || 'NULL',
        });
        await this.taskTypeRepository.save(newTaskType);
        return ResultService.created<TaskTypeResponse>(newTaskType as TaskTypeResponse, "messages.task.taskTypes.created");
    }
    async updateTaskType(userId: string, id: string, taskType: UpdateTaskTypeDto): PromiseResult<TaskTypeResponse> {
        const taskTypeResult = await this.taskTypeRepository.findOne({
            where: { id, user: { id: userId } }
        });

        if (!taskTypeResult) {
            return ResultService.notFound<TaskTypeResponse>('errors.task.taskTypes.notFound');
        }

        if (taskTypeResult.freeze) {
            return ResultService.badRequest<TaskTypeResponse>('errors.task.taskTypes.updateFreeze');
        }

        taskTypeResult.description = taskType?.description?.trim() || 'NULL';
        taskTypeResult.isActive = taskType?.isActive || false;

        const result = await this.taskTypeRepository.save(taskTypeResult);
        return ResultService.updated<TaskTypeResponse>(result as TaskTypeResponse, 'messages.task.taskTypes.updated');
    }
    async deleteTaskType(userId: string, id: string): PromiseResult<null> {
        const taskTypeResult = await this.taskTypeRepository.findOne({
            where: { id, user: { id: userId } }
        });

        if (!taskTypeResult) {
            return ResultService.notFound<null>('errors.task.taskTypes.notFound');
        }

        if (taskTypeResult.freeze) {
            return ResultService.badRequest<null>('errors.task.taskTypes.deleteFreeze');
        }

        await this.taskTypeRepository.remove(taskTypeResult);
        return ResultService.deleted(null, 'messages.task.taskTypes.deleted');
    }
}