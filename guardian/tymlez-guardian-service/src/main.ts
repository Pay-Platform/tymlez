import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import express from 'express';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { PORT } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: false }));
  app.useLogger(app.get(Logger));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb' }));

  const config = new DocumentBuilder()
    .setTitle('Tymlez Guardian Service API')
    .setDescription('The service to talk with Guardian')
    .setVersion('1.0')
    .addTag('guardian')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}
bootstrap();
