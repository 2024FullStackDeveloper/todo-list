import { PromiseResult } from "common/interfaces/result.interface";
import { LoginDto } from "../dto/login.dto";
import { LoginResponse, UserDetails } from "./login-response.interface";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { ChangePasswordDto } from "../dto/change-password.dto";
import { RefreshTokenResponse } from "./regresh-token-response";
import { RegisterDto } from "../dto/register.dto";


export interface IAuthService {
    login(dto: LoginDto): PromiseResult<LoginResponse>;
    register(dto: RegisterDto): PromiseResult<UserDetails>;
    refreshToken(email: string): PromiseResult<RefreshTokenResponse>;
    requestPasswordReset(dto: ResetPasswordDto): PromiseResult<null>;
    changePassword(dto: ChangePasswordDto): PromiseResult<boolean>;
}