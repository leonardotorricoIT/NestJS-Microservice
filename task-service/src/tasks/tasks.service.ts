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
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';

interface UserService {
  validateUser(data: {
    id: number;
  }): Observable<{ exists: boolean; user?: any }>;
}

@Injectable()
export class TaskService implements OnModuleInit {
  private userService: UserService;

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @Inject('USER_PACKAGE') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  async createTask(
    title: string,
    description: string,
    created_by: number,
  ): Promise<Task> {
    try {
      const userValidation = await firstValueFrom(
        this.userService.validateUser({ id: created_by }),
      );

      if (!userValidation.exists) {
        throw new BadRequestException(
          `User with ID ${created_by} does not exist`,
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error validating user');
    }

    const task = this.taskRepository.create({
      title,
      description,
      created_by,
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
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (task.completed) {
      throw new BadRequestException(`Task with ID ${id} is already completed`);
    }

    task.completed = true;
    return await this.taskRepository.save(task);
  }
}
