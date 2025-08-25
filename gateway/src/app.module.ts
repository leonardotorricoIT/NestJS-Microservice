import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UsersHttpController } from './modules/users/users.http.controller';
import { TasksHttpController } from './modules/tasks/tasks.http.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(__dirname, '../../proto/user.proto'),
          url: '0.0.0.0:5001',
          loader: { keepCase: true },
        },
      },
      {
        name: 'TASK_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'task',
          protoPath: join(__dirname, '../../proto/task.proto'),
          url: '0.0.0.0:5002',
          loader: { keepCase: true },
        },
      },
    ]),
  ],
  controllers: [UsersHttpController, TasksHttpController],
})
export class AppModule {}
