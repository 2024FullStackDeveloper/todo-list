import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const updateProfileSchema = z.object({
    firstName: z.string({ error: 'errors.validations.firstNameRequired' }).min(1, { error: 'errors.validations.firstNameRequired' }).superRefine(((value, ctx) => {
        if (!value) return;
        if (value.trim().split(' ')?.length > 1) ctx.addIssue({ code: 'custom', message: 'errors.validations.firstNameMustBeOneWord' })
    })),
    lastName: z.string({ error: 'errors.validations.lastNameRequired' }).min(1, { error: 'errors.validations.lastNameRequired' }).superRefine(((value, ctx) => {
        if (!value) return;
        if (value.trim().split(' ')?.length > 1) ctx.addIssue({ code: 'custom', message: 'errors.validations.lastNameMustBeOneWord' })
    })),
}).strict();


export class UpdateProfileDto extends createZodDto(updateProfileSchema) { }