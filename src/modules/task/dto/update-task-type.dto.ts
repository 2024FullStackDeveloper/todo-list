import { createZodDto } from "nestjs-zod";
import { createTaskTypeSchema } from "./create-task-type.dto";
export const updateTaskTypeSchema = createTaskTypeSchema.pick({ description: true, isActive: true }).strict();
export class UpdateTaskTypeDto extends createZodDto(updateTaskTypeSchema) { }