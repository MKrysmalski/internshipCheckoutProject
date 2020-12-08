import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {

    const logger = new Logger('bootstrap');
    const app = await NestFactory.create(AppModule);
    const options = new DocumentBuilder()
        .setTitle('Checkout')
        .setDescription('Checkout API')
        .setVersion('1.0')
        .addTag('checkout')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
    logger.log(`Application listening on port 3000`);
}
bootstrap();
