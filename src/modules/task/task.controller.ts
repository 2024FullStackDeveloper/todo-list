import { Body, Controller, Delete, Get, Inject, Param, ParseUUIDPipe, Post, Put, Query } from "@nestjs/common";
import type { ITask } from "./interfaces/task.interface";
import { TASK_SERVICE } from "./constrants";
import type { PromiseResult } from "common/interfaces/result.interface";
import { TaskTypeResponse } from "./interfaces/task-type-response.interface";
import { Auth } from "common/decorators";
import { CreateTaskTypeDto } from "./dto/create-task-type.dto";
import { UpdateTaskTypeDto } from "./dto/update-task-type.dto";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskResponse } from "./interfaces/task-response.interface";
import { User } from "common/decorators/user.decorator";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskFilterDto } from "./dto/task-filter.dto";
import { PageDto } from "common/dto/page-meta.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Tasks', 'Task Types')
@ApiBearerAuth()
@Controller('tasks')
@Auth()
export class TaskController {
    constructor(@Inject(TASK_SERVICE) private readonly taskService: ITask) { }

    @Get('task-types')
    @ApiOperation({ summary: 'Get all task types' })
    public async getTaskTypes(@User('id') userId: string): PromiseResult<TaskTypeResponse[]> {
        return await this.taskService.getAllTaskTypes(userId);
    }

    @Post('task-types')
    @ApiOperation({ summary: 'Create a new task type' })
    public async createTaskType(@User('id') userId: string, @Body() createTaskTypeRequest: CreateTaskTypeDto): PromiseResult<TaskTypeResponse> {
        return await this.taskService.createTaskType(userId, createTaskTypeRequest);
    }

    @Get('task-types/:id')
    @ApiOperation({ summary: 'Get a task type by ID' })
    public async getTaskType(@User('id') userId: string, @Param('id', ParseUUIDPipe) id: string): PromiseResult<TaskTypeResponse> {
        return await this.taskService.getTaskType(userId, id);
    }

    @Put('task-types/:id')
    @ApiOperation({ summary: 'Update a task type' })
    public async updateTaskType(@User('id') userId: string, @Param('id', ParseUUIDPipe) id: string, @Body() updateTaskTypeRequest: UpdateTaskTypeDto): PromiseResult<TaskTypeResponse> {
        return await this.taskService.updateTaskType(userId, id, updateTaskTypeRequest);
    }

    @Delete('task-types/:id')
    @ApiOperation({ summary: 'Delete a task type' })
    public async deleteTaskType(@User('id') userId: string, @Param('id', ParseUUIDPipe) id: string): PromiseResult<void> {
        return await this.taskService.deleteTaskType(userId, id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new task' })
    public async createTask(@User('id') userId: string, @Body() createTaskRequest: CreateTaskDto): PromiseResult<TaskResponse> {
        return await this.taskService.createTask(userId, createTaskRequest);
    }

    @Get()
    @ApiOperation({ summary: 'Search and paginate tasks' })
    public async getTasks(@User('id') userId: string, @Query() query: TaskFilterDto): PromiseResult<PageDto<TaskResponse>> {
        return await this.taskService.searchTasks(userId, query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a task by ID' })
    public async getTask(@User('id') userId: string, @Param('id', ParseUUIDPipe) id: string): PromiseResult<TaskResponse> {
        return await this.taskService.getTaskById(userId, id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a task' })
    public async updateTask(@User('id') userId: string, @Param('id', ParseUUIDPipe) id: string, @Body() updateTaskRequest: UpdateTaskDto): PromiseResult<TaskResponse> {
        return await this.taskService.updateTask(userId, id, updateTaskRequest);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a task' })
    public async deleteTask(@User('id') userId: string, @Param('id', ParseUUIDPipe) id: string): PromiseResult<void> {
        return await this.taskService.deleteTask(userId, id);
    }


}