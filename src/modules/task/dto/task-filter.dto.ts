import { pageOptionsSchema } from "common/dto/page-options.dto";
import z from "zod";
import { Priority } from "../enums/priority.enum";
import { createZodDto } from "nestjs-zod";

export const taskFilterSchema = pageOptionsSchema.extend({
    priority: z.enum(Priority).optional(),
    isCompleted: z.boolean().optional(),
    taskTypeId: z.string().optional(),
    completedAt: z.string().transform((value) => new Date(value)).refine((date) => !isNaN(date.getTime()), { message: 'Invalid date' }).optional(),
    dueDate: z.string().transform((value) => new Date(value)).refine((date) => !isNaN(date.getTime()), { message: 'Invalid date' }).optional(),
});


export class TaskFilterDto extends createZodDto(taskFilterSchema) { }