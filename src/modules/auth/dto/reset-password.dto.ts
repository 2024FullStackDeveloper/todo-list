import { createZodDto } from "nestjs-zod";
import { LoginSchema } from "./login.dto";

export const resetPasswordSchema = LoginSchema.pick({ email: true }).strict();
export class ResetPasswordDto extends createZodDto(resetPasswordSchema) { }