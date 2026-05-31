import { Module } from '@nestjs/common';
import { User } from './models/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { USER_SERVICE } from './constants';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ], providers: [
        {
            provide: USER_SERVICE,
            useClass: UsersService
        }
    ],
    exports: [USER_SERVICE]
})
export class UsersModule {
}
