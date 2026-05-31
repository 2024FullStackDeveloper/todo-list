import { z } from "zod";
import { Priority } from "../enums/priority.enum";
import { createZodDto } from "nestjs-zod";

export const createTaskSchema = z.object({
    taskType: z.string({ error: 'errors.task.taskTypeRequired' }),
    title: z.string({ error: 'errors.task.titleRequired' }),
    description: z.string().optional().nullable(),
    priority: z.enum(Priority).refine((value) => Object.values(Priority).includes(value), { error: 'errors.task.priorityRequired' }),
    dueDate: z.string({ error: 'errors.task.dueDateRequired' })
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'errors.task.dueDateNotValid' })
        .transform((value) => new Date(value))
        .refine((date) => !isNaN(date.getTime()), { message: 'errors.task.dueDateNotValid' })
        .refine((date) => date >= new Date(new Date().toISOString().split('T')[0]), { message: 'errors.task.dueDateNotValid' })
        .optional().nullable(),
}).strict();

export class CreateTaskDto extends createZodDto(createTaskSchema) { }
