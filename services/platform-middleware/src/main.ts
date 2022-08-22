import assert from 'assert';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { CorrelationIdMiddleware } from '@eropple/nestjs-correlation-id';
import { Logger } from 'nestjs-pino';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { migrateDb, runSeeds } from './db';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(CorrelationIdMiddleware());
  app.useLogger(app.get(Logger));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb' }));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Platform API Middleware')
    .setDescription('Platform Middleware')
    .setVersion('1.0')
    .addTag('platform')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT');
  const hostname = '0.0.0.0';
  assert(port, `port is missing`);

  console.log(
    `Staring Platform Middleware at //${hostname}:${port}, VERSION: ${process.env.GIT_TAG}`,
  );
  await migrateDb();
  await runSeeds();
  await app.listen(port, hostname);
}

bootstrap();
