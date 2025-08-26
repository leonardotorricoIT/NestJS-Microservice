import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { firstValueFrom } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import {
  UserServiceClient,
  GetUserByIdRequest,
  UserValidationResponse,
  USER_SERVICE_NAME,
} from '../proto/user';
import { status } from '@grpc/grpc-js';

@Injectable()
export class TaskService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @Inject('USER_PACKAGE') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async createTask(
    title: string,
    description: string,
    createdBy: number,
  ): Promise<Task> {
    try {
      const userValidation = await firstValueFrom(
        this.userService.validateUser({ id: createdBy }),
      );

      console.log('USER VALIDATION!', userValidation.exists);

      if (userValidation.exists === false) {
        console.log('USER DOES NOT EXIST - THROWING RPC EXCEPTION');
        throw new RpcException({
          code: status.NOT_FOUND,
          message: `User with ID ${createdBy} does not exist`,
        });
      }
    } catch (error) {
      console.error('ERROR IN USER VALIDATION:', error);

      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        code: status.INTERNAL,
        message: 'Error validating user with User Service',
      });
    }

    const task = this.taskRepository.create({
      title,
      description,
      createdBy,
      completed: false,
    });

    return await this.taskRepository.save(task);
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async completeTask(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `Task with ID ${id} not found`,
      });
    }

    if (task.completed) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: `Task with ID ${id} is already completed`,
      });
    }

    task.completed = true;
    return await this.taskRepository.save(task);
  }
}
