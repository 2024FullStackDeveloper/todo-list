import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import path from "path";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseSeederModule } from "../../database/database-seeder.module";
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { AppExceptionFilter } from "common/filters/app-exception-filter";
import { AppInterceptor } from "common/interceptors/app.interceptor";
import { ZodValidationPipe } from "nestjs-zod";
import { MailerModule } from "@nestjs-modules/mailer";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { AuthGuard } from "common/guards/auth.guard";
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: path.resolve(__dirname, '../../.env')
        }),
        I18nModule.forRoot({
            fallbackLanguage: 'ar',
            fallbacks: {
                'en-*': 'en',
                'ar-*': 'ar',
                en: 'en',
                ar: 'ar',
            },
            loaderOptions: {
                path: path.join(process.cwd(), 'src', 'i18n'),
                watch: true
            },
            resolvers: [
                { use: QueryResolver, options: ['lang'] },
                AcceptLanguageResolver,
                { use: HeaderResolver, options: ['x-lang'] },
            ]
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => {
                return {
                    type: config.get<string>('DB_TYPE') as any,
                    host: config.get<string>('DB_HOST'),
                    port: config.get<number>('DB_PORT'),
                    username: config.get<string>('DB_USERNAME'),
                    password: config.get<string>('DB_PASSWORD'),
                    database: config.get<string>('DB_NAME'),
                    synchronize: config.get<string>('NODE_ENV') !== 'production',
                    autoLoadEntities: true,
                }
            }
        }),
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => {
                return {
                    transport: {
                        host: config.get<string>('SMTP_HOST'),
                        port: config.get<number>('SMTP_PORT'),
                        secure: false,
                        auth: {
                            user: config.get<string>('SMTP_USER'),
                            pass: config.get<string>('SMTP_PASSWORD'),
                        }
                    },
                    defaults: {
                        from: `"FutureSoft Tecnology" <${config.get<string>('SMTP_USER')}>`
                    }
                }
            }
        }),
        EventEmitterModule.forRoot(),
        DatabaseSeederModule
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AppExceptionFilter
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: AppInterceptor
        },
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe,
        },
    ],
    exports: []
})
export class CoreModule { }