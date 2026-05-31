import { Injectable } from '@nestjs/common';
import { IUserService } from './interfaces/users.interface';
import { User } from './models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService implements IUserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(data: { firstName: string; lastName: string; email: string; hashedPassword: string; }): Promise<User> {
        return await this.userRepository.save(data);
    }

    async setNewPassword(id: string, hashedPassword: string): Promise<void> {
        await this.userRepository.update(id, {
            hashedPassword: hashedPassword,
            otp: () => 'NULL',
            otpExpiresAt: () => 'NULL'
        });
    }
    async updateOtp(id: string, otp: string, otpExpiry: Date): Promise<void> {
        await this.userRepository.update(id, {
            otp: otp,
            otpExpiresAt: otpExpiry
        });
    }

    async setLastLoginNow(userId: string): Promise<User | null> {
        await this.userRepository.update(userId, {
            loginAt: () => "NOW()"
        });
        return this.findById(userId);
    }

    async findById(id: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: {
                id
            }
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: {
                email
            }
        });
    }

}
