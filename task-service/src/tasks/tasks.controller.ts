import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TaskService } from './tasks.service';
import {
  Task,
  CreateTaskRequest,
  TasksResponse,
  CompleteTaskRequest,
} from '../proto/task';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @GrpcMethod('TaskService', 'CreateTask')
  async createTask(data: CreateTaskRequest): Promise<Task> {
    const task = await this.taskService.createTask(
      data.title,
      data.description,
      data.createdBy,
    );
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdBy: task.createdBy,
      createdAt: task.created_at.toISOString(),
    };
  }

  @GrpcMethod('TaskService', 'GetAllTasks')
  async getAllTasks(): Promise<TasksResponse> {
    const tasks = await this.taskService.getAllTasks();
    return {
      tasks: tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        completed: task.completed,
        createdBy: task.createdBy,
        createdAt: task.created_at.toISOString(),
      })),
    };
  }

  @GrpcMethod('TaskService', 'CompleteTask')
  async completeTask(data: CompleteTaskRequest): Promise<Task> {
    const task = await this.taskService.completeTask(data.id);
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdBy: task.createdBy,
      createdAt: task.created_at.toISOString(),
    };
  }
}
