import { createZodDto } from "nestjs-zod";
import z from "zod";

export const changePasswordSchema = z.object({
    email: z.string({ error: 'errors.validations.emailRequired' }).email('errors.validations.invalidEmail'),
    otp: z.string().min(1, { error: 'errors.validations.otpRequired' }),
    newPassword: z.string().min(5, { error: 'errors.validations.passwordTooShort' })
}).strict();

export class ChangePasswordDto extends createZodDto(changePasswordSchema) { }