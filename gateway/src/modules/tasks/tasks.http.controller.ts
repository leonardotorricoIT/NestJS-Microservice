import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { CreateTaskDto } from '../users/dto/dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface TaskServiceClient {
  CreateTask(data: {
    title: string;
    description?: string;
    created_by: number;
  }): Promise<any>;
  GetAllTasks(data: {}): Promise<{ tasks: any[] }>;
  CompleteTask(data: { id: number }): Promise<any>;
}

@ApiTags('Users')
@Controller('tasks')
export class TasksHttpController {
  private taskSvc: TaskServiceClient;

  constructor(@Inject('TASK_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.taskSvc = this.client.getService<TaskServiceClient>('TaskService');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  create(@Body() dto: CreateTaskDto) {
    return this.taskSvc.CreateTask(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all tasks' })
  list() {
    return this.taskSvc.GetAllTasks({});
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark task as completed' })
  complete(@Param('id') id: string) {
    return this.taskSvc.CompleteTask({ id: Number(id) });
  }
}
