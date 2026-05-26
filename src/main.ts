
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runMigrations } from './database/run-migrations';
import { VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  await runMigrations();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api')
  app.useBodyParser('json', { limit: '50mb' });
  app.useBodyParser('urlencoded', { limit: '50mb', extended: true });
  app.enableCors();
  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
