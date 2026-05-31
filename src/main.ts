
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runMigrations } from './database/run-migrations';
import { VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';


const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
const isDev = process.env.NODE_ENV === 'development' || false;

async function bootstrap() {
  await runMigrations();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api')
  app.useBodyParser('json', { limit: '10mb' });
  app.useBodyParser('urlencoded', { limit: '10mb', extended: true });
  app.enableCors({
    origin: isDev ? true : allowedOrigins,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Accept-Language',
    ],
    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH',
      'OPTIONS'
    ],
    credentials: true,
    maxAge: 3600
  });
  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });

  const config = new DocumentBuilder()
    .setTitle('Todo List API')
    .setDescription('API documentation for the Todo List application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, cleanupOpenApiDoc(document));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
