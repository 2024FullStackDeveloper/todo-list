import { Module } from '@nestjs/common';
import { CoreModule } from './common/modules/core.module';
import { UsersModule } from './modules/users/users.module';
import { TaskModule } from './modules/task/task.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [CoreModule, UsersModule, TaskModule, AuthModule, ProfileModule],
})
export class AppModule { }

