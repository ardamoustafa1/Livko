import { NestFactory } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: process.env.CORS_ORIGIN || '*', credentials: true });
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Indoor Smart Navigation API')
    .setDescription(
      'QR Code Based Web-Driven Indoor Smart Navigation System - Backend API. Supports hospitals, airports, and smart buildings.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'JWT',
    )
    .addTag('Auth', 'Authentication and token management')
    .addTag('Users', 'Admin and staff user management')
    .addTag('Institutions', 'Multi-tenant institution management')
    .addTag('Buildings', 'Building management')
    .addTag('Floors', 'Floor management')
    .addTag('Rooms', 'Room management')
    .addTag('Elevators', 'Elevator management')
    .addTag('Stairs', 'Stair management')
    .addTag('Exits', 'Exit management')
    .addTag('QR Codes', 'QR code to node mapping')
    .addTag('Routes', 'Route computation and navigation')
    .addTag('Accessibility', 'Accessibility rules and preferences')
    .addTag('Emergency', 'Emergency mode and state')
    .addTag('Admin', 'Administrative operations')
    .addTag('Labels', 'Multi-language labels')
    .addTag('Health', 'Health check')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.API_PORT || 3000;
  await app.listen(port);
}

bootstrap();
