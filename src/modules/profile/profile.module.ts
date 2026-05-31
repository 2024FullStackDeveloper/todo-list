import { Global, Module } from '@nestjs/common';
import { PROFILE_SERVICE } from './constrants';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'modules/users/models/user.entity';
import { ProfileController } from './profile.controller';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [ProfileController],
    providers: [
        {
            provide: PROFILE_SERVICE,
            useClass: ProfileService
        }
    ],
    exports: [
        PROFILE_SERVICE
    ]
})
export class ProfileModule { }
