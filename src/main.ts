import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import AppModule from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  app.enableVersioning({
    type: VersioningType.URI
  });

  const config = new DocumentBuilder()
    .setTitle('Compass Wallet API')
    .setDescription('API de gestão de carteira digital')
    .setVersion('1.0')
    .addTag('wallet')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/docs-api', app, document);

  await app.listen(3000);
}
bootstrap();
