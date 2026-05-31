import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AUTH_SERVICE } from './constants';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'common/guards/auth.guard';
import { OtpService } from 'common/services/otp.service';
import { MailService } from 'common/services/mail.service';
import { SeedPrimaryTaskTypesService } from 'database/seed-primary-task-types.service';
import { TaskTypes } from 'modules/task/models/task-types.entity';
import { User } from 'modules/users/models/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskTypes, User]),
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: parseInt(config.get<string>('JWT_EXPIRE_IN') as any || '1h'),
        }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService
    },
    AuthGuard,
    OtpService,
    MailService,
    SeedPrimaryTaskTypesService
  ],
  exports: [AUTH_SERVICE, AuthGuard]
})
export class AuthModule { }
