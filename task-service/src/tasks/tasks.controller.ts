import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TaskService } from './tasks.service';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @GrpcMethod('TaskService', 'CreateTask')
  async createTask(data: {
    title: string;
    description: string;
    createdBy: number;
  }) {
    console.log('Received CreateTask request with data:', data);
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
      created_at: task.created_at.toISOString(),
    };
  }

  @GrpcMethod('TaskService', 'GetAllTasks')
  async getAllTasks() {
    const tasks = await this.taskService.getAllTasks();
    return {
      tasks: tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        completed: task.completed,
        createdBy: task.createdBy,
        created_at: task.created_at.toISOString(),
      })),
    };
  }

  @GrpcMethod('TaskService', 'CompleteTask')
  async completeTask(data: { id: number }) {
    const task = await this.taskService.completeTask(data.id);
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdBy: task.createdBy,
      created_at: task.created_at.toISOString(),
    };
  }
}
