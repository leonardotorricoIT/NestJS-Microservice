import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'task',
        protoPath: join(__dirname, '../../proto/task.proto'),
        url: '0.0.0.0:5002',
        loader: { keepCase: true },
      },
    },
  );

  await app.listen();
  console.log('Task Service is listening on port 5002');
}
bootstrap();
