import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Название вашего API сервиса')
    .setDescription('Назначение API сервиса (описание)')
    .setVersion('1.0')
    .build();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);
  await app.listen(3000);
}
bootstrap();
