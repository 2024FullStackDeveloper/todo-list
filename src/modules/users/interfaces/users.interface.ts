import { User } from "../models/user.entity";

export interface IUserService {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    setLastLoginNow(userId: string): Promise<User | null>;
    updateOtp(id: string, otp: string, otpExpiry: Date): Promise<void>;
    setNewPassword(id: string, hashedPassword: string): Promise<void>;
    create(data: { firstName: string; lastName: string; email: string; hashedPassword: string }): Promise<User>;
}