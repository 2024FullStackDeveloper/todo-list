import { createZodDto } from "nestjs-zod";
import { z } from "zod";


export const registerSchema = z.object({
    firstName: z.string({
        error: 'errors.validations.firstNameRequired',
    }).min(1, {
        message: 'errors.validations.firstNameRequired',
    }).superRefine((value, ctx) => {
        if (value?.trim()?.split(' ')?.length > 1) {
            ctx.addIssue({
                code: 'custom',
                message: 'errors.validations.firstNameMustBeOneWord',
            });
        }
    }),
    lastName: z.string({
        error: 'errors.validations.lastNameRequired',
    }).min(1, {
        message: 'errors.validations.lastNameRequired',
    }).superRefine((value, ctx) => {
        if (value?.trim()?.split(' ')?.length > 1) {
            ctx.addIssue({
                code: 'custom',
                message: 'errors.validations.lastNameMustBeOneWord',
            });
        }
    }),
    email: z.string({
        error: 'errors.validations.emailIsRequired',
    }).email('errors.validations.invalidEmail'),
    password: z.string({
        error: 'errors.validations.passwordIsRequired',
    }).min(5, { error: 'errors.validations.passwordTooShort' }),
});

export class RegisterDto extends createZodDto(registerSchema) { }