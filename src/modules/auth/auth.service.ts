import { Injectable } from "@nestjs/common";
import { IAuthService } from "./interfaces/auth.interface";
import { LoginDto } from "./dto/login.dto";
import { LoginResponse, UserDetails } from "./interfaces/login-response.interface";
import type { PromiseResult } from "common/interfaces/result.interface";
import type { IUserService } from "modules/users/interfaces/users.interface";
import { USER_SERVICE } from "modules/users/constants";
import { Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ResultService } from "common/services/result.service";
import { BecryptService } from "common/services/becrypt.service";
import { ConfigService } from "@nestjs/config";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { OtpService } from "common/services/otp.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SEND_OTP_CODE_EVENT, USER_REGISTERED_EVENT } from "common/constrants/events.constrant";
import { SendOtpEvent } from "./events/send-otp-event";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { RefreshTokenResponse } from "./interfaces/regresh-token-response";
import { RegisterDto } from "./dto/register.dto";
import { RegisterEvent } from "./events/register-event";
import { SeedPrimaryTaskTypesService } from "database/seed-primary-task-types.service";

@Injectable()
export class AuthService implements IAuthService {
    private readonly bycryptService: BecryptService;
    constructor(
        @Inject(USER_SERVICE) private readonly userService: IUserService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly otpService: OtpService,
        private readonly eventEmitter: EventEmitter2,
        private readonly seedPrimaryTaskTypesService: SeedPrimaryTaskTypesService
    ) { this.bycryptService = new BecryptService(); }

    async register(dto: RegisterDto): PromiseResult<UserDetails> {
        const user = await this.userService.findByEmail(dto.email.toLowerCase().trim());
        if (user) {
            return ResultService.badRequest('errors.auth.emailAlreadyExists');
        }
        const newUser = await this.userService.create({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email.toLowerCase().trim(),
            hashedPassword: this.bycryptService.hash(dto.password)
        });

        await this.seedPrimaryTaskTypesService.addPrimaryTaskTypesToUser(newUser.id);
        const { hashedPassword, otp, otpExpiresAt, ...userDetails } = newUser;
        this.eventEmitter.emit(USER_REGISTERED_EVENT, new RegisterEvent(userDetails.email));
        return ResultService.created<UserDetails>(userDetails, 'messages.auth.registered');
    }

    async refreshToken(email: string): PromiseResult<RefreshTokenResponse> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            return ResultService.notFound('errors.auth.emailNotFound');
        }
        return ResultService.success<RefreshTokenResponse>(
            {
                accessToken: this.jwtService.sign({ id: user.id, email: user.email }),
                refreshToken: this.jwtService.sign({ id: user.id, email: user.email }, {
                    expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE_IN') as any || '7d'
                }),
                tokenType: 'Bearer',
                expiresIn: parseInt(this.configService.get<string>('JWT_EXPIRE_IN') as any || '24h')
            }
        );
    }

    async changePassword(dto: ChangePasswordDto): PromiseResult<boolean> {
        const user = await this.userService.findByEmail(dto.email);
        if (!user) {
            return ResultService.notFound('errors.auth.emailNotFound');
        }

        // check if the otp is matched and not expired
        if (user?.otp !== dto.otp) {
            return ResultService.badRequest('errors.auth.otp.otpInvalid');
        }

        if (user?.otp === dto.otp && user?.otpExpiresAt && user?.otpExpiresAt < new Date()) {
            return ResultService.badRequest('errors.auth.otp.otpExpired');
        }

        await this.userService.setNewPassword(user.id, this.bycryptService.hash(dto.newPassword));
        return ResultService.success<boolean>(true, 'messages.auth.passwordChanged');
    }

    async requestPasswordReset(dto: ResetPasswordDto): PromiseResult<null> {
        const user = await this.userService.findByEmail(dto.email);
        if (!user) {
            return ResultService.notFound('errors.auth.emailNotFound');
        }
        const otp = this.otpService.generate();
        await this.userService.updateOtp(user.id, otp, new Date(Date.now() + 10 * 60 * 1000));
        this.eventEmitter.emit(SEND_OTP_CODE_EVENT, new SendOtpEvent(user.email, otp, 10));
        return ResultService.success(null, 'messages.auth.otp.sent');
    }

    async login(dto: LoginDto): PromiseResult<LoginResponse> {
        const user = await this.userService.findByEmail(dto.email.toLowerCase().trim());
        if (!user || !this.bycryptService.verify(dto.password, user?.hashedPassword))
            return ResultService.unauthorized('errors.auth.invalidCredentials');

        const updatedUser = await this.userService.setLastLoginNow(user.id);
        return ResultService.success<LoginResponse>(
            {
                userDetails: {
                    id: updatedUser!.id,
                    firstName: updatedUser!.firstName,
                    lastName: updatedUser!.lastName,
                    email: updatedUser!.email,
                    createdAt: updatedUser!.createdAt,
                    updatedAt: updatedUser!.updatedAt,
                    loginAt: updatedUser?.loginAt,
                    isActive: updatedUser!.isActive
                },
                accessToken: this.jwtService.sign({ id: user.id, email: user.email }),
                refreshToken: this.jwtService.sign({ id: user.id, email: user.email }, {
                    expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE_IN') as any || '7d'
                }),
                tokenType: 'Bearer',
                expiresIn: parseInt(this.configService.get<string>('JWT_EXPIRE_IN') as any || '24h')
            }
        )
    }
}