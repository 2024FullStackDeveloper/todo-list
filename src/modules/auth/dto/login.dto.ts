import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string({ error: 'errors.validations.emailRequired' }).email('errors.validations.invalidEmail'),
    password: z.string({ error: 'errors.validations.passwordRequired' }).min(1, 'errors.validations.passwordRequired')
}).strict();

export class LoginDto extends createZodDto(LoginSchema) { }