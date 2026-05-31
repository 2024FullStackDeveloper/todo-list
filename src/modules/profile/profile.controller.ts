import { Body, Controller, Get, Inject, Put } from '@nestjs/common';
import { PROFILE_SERVICE } from './constrants';
import { type IProfile } from './interfaces/profile.interface';
import { User } from 'common/decorators/user.decorator';
import { type PromiseResult } from 'common/interfaces/result.interface';
import { UserDetails } from 'modules/auth/interfaces/login-response.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Auth } from 'common/decorators';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
@Auth()
export class ProfileController {
    constructor(@Inject(PROFILE_SERVICE) private readonly profileService: IProfile) { }

    @Get()
    @ApiOperation({ summary: 'Get current user profile' })
    async getMyProfile(@User("id") userId: string): PromiseResult<UserDetails> {
        return await this.profileService.getOwnProfile(userId);
    }

    @Put()
    @ApiOperation({ summary: 'Update current user profile' })
    async updateMyProfile(@User("id") userId: string, @Body() dto: UpdateProfileDto): PromiseResult<UserDetails> {
        return await this.profileService.updateOwnProfile(userId, dto);
    }
}
