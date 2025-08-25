import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  OnModuleInit,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { CreateTaskDto } from '../users/dto/dto';
import {
  TaskServiceClient,
  CreateTaskRequest,
  CompleteTaskRequest,
  Empty,
} from '../../proto/task';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksHttpController implements OnModuleInit {
  private taskSvc: TaskServiceClient;

  constructor(@Inject('TASK_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.taskSvc = this.client.getService<TaskServiceClient>('TaskService');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  create(@Body() dto: CreateTaskDto) {
    const request: CreateTaskRequest = {
      title: dto.title,
      description: dto.description ?? '',
      createdBy: dto.createdBy,
    };
    return this.taskSvc.createTask(request);
  }

  @Get()
  @ApiOperation({ summary: 'List all tasks' })
  list() {
    const request: Empty = {};
    return this.taskSvc.getAllTasks(request);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark task as completed' })
  complete(@Param('id') id: string) {
    const request: CompleteTaskRequest = { id: Number(id) };
    return this.taskSvc.completeTask(request);
  }
}
