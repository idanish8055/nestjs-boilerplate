import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /* 
  * GlobalPipes for validating DTO automatically if exist 
  */
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: { //enable it to skip the Type conversion on DTO level from class transformer
      enableImplicitConversion: true 
    }
  }));
  
  /*
  * Swagger Configuration
  */
  const config = new DocumentBuilder()
    .setTitle('NestJS App - Blogs')
    .setDescription('Use the base API url as http://localhost:3000/')
    .setTermsOfService('http://localhost:3000/terms-of-service')
    .setLicense('MIT License', 'http://localhost:3000/mit-license.txt')
    .addServer('http://localhost:3000/')
    .setVersion('1.0')
    .build();
  // Instantiate document
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
