import { createZodDto } from "nestjs-zod";
import z from "zod";

export const createTaskTypeSchema = z.object({
    name: z.string({ error: 'errors.validations.nameRequired' }).min(1, { message: 'errors.validations.nameRequired' }),
    description: z.string().optional().nullable(),
    isActive: z.boolean().optional().default(true),
}).strict();

export class CreateTaskTypeDto extends createZodDto(createTaskTypeSchema) { }