import { User } from "modules/users/models/user.entity";

export interface UserDetails extends Omit<User, 'hashedPassword' | 'otp' | 'otpExpiresAt' | 'tasks'> { }

export interface LoginResponse {
    userDetails: UserDetails
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}
