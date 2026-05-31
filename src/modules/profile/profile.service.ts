import { Injectable } from '@nestjs/common';
import { IProfile } from './interfaces/profile.interface';
import { PromiseResult } from 'common/interfaces/result.interface';
import { UserDetails } from 'modules/auth/interfaces/login-response.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Repository } from 'typeorm';
import { User } from 'modules/users/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultService } from 'common/services/result.service';

@Injectable()
export class ProfileService implements IProfile {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

    async getOwnProfile(id: string): PromiseResult<UserDetails> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) return ResultService.notFound('errors.profile.notFound');
        const { hashedPassword, tasks, otp, otpExpiresAt, ...rest } = user;
        return ResultService.success(rest);
    }

    async updateOwnProfile(id: string, data: UpdateProfileDto): PromiseResult<UserDetails> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) return ResultService.notFound('errors.profile.notFound');
        const updatedUser = this.userRepository.merge(user, data);
        const result = await this.userRepository.save(updatedUser);
        const { hashedPassword, tasks, otp, otpExpiresAt, ...rest } = result;
        return ResultService.updated(rest, 'messages.profile.updated');
    }
}
