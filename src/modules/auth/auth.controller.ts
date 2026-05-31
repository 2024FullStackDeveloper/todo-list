import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import type { IAuthService } from './interfaces/auth.interface';
import { AUTH_SERVICE } from './constants';
import { LoginDto } from './dto/login.dto';
import type { PromiseResult } from 'common/interfaces/result.interface';
import { LoginResponse, UserDetails } from './interfaces/login-response.interface';
import { User } from 'common/decorators/user.decorator';
import { Auth } from 'common/decorators';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshTokenResponse } from './interfaces/regresh-token-response';
import { RegisterDto } from './dto/register.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        @Inject(AUTH_SERVICE) private readonly authService: IAuthService
    ) { }

    @Post('login')
    @ApiOperation({ summary: 'Login and receive JWT tokens' })
    async login(@Body() dto: LoginDto): PromiseResult<LoginResponse> {
        return await this.authService.login(dto);
    }

    @Get('refresh')
    @ApiOperation({ summary: 'Refresh access and refresh tokens' })
    @ApiBearerAuth()
    @Auth()
    async refresh(@User('email') email: string): PromiseResult<RefreshTokenResponse> {
        return await this.authService.refreshToken(email);
    }

    @Post('reset-password/send-otp')
    @ApiOperation({ summary: 'Send OTP code to email for password reset' })
    async sendOtp(@Body() dto: ResetPasswordDto): PromiseResult<null> {
        return await this.authService.requestPasswordReset(dto);
    }

    @Post('reset-password/change')
    @ApiOperation({ summary: 'Change password using OTP' })
    async changePassword(@Body() dto: ChangePasswordDto): PromiseResult<boolean> {
        return await this.authService.changePassword(dto);
    }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    async register(@Body() dto: RegisterDto): PromiseResult<UserDetails> {
        return await this.authService.register(dto);
    }
}
