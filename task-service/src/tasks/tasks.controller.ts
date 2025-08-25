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
    created_by: number;
  }) {
    const task = await this.taskService.createTask(
      data.title,
      data.description,
      data.created_by,
    );
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      created_by: task.created_by,
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
        created_by: task.created_by,
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
      created_by: task.created_by,
      created_at: task.created_at.toISOString(),
    };
  }
}
