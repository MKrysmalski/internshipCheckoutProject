import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { join } from 'path'

const logger = new Logger('Main');
const microserviceOptions = {
    transport: Transport.GRPC,
    options: {
        url:'localhost:4321',
        package: 'app',
        protoPath: join(__dirname, '../../src/grpc/app.proto'),
    },
}

async function bootstrap() {
    const app = await NestFactory.createMicroservice(AppModule,microserviceOptions);
    await app.listen(()=> {
        logger.log('Microservice is listening');
    });
}
bootstrap();
