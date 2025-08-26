import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  OnModuleInit,
  UseFilters,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTaskDto } from '../users/dto/dto';
import { GrpcExceptionFilter } from '../../filters/grpc-exception.filter';
import {
  TaskServiceClient,
  CreateTaskRequest,
  CompleteTaskRequest,
  Empty,
} from '../../proto/task';
import { firstValueFrom } from 'rxjs';

@ApiTags('Tasks')
@Controller('tasks')
@UseFilters(GrpcExceptionFilter)
export class TasksHttpController implements OnModuleInit {
  private taskSvc: TaskServiceClient;

  constructor(@Inject('TASK_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.taskSvc = this.client.getService<TaskServiceClient>('TaskService');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async create(@Body() dto: CreateTaskDto) {
    const request: CreateTaskRequest = {
      title: dto.title,
      description: dto.description ?? '',
      createdBy: dto.createdBy,
    };

    return await firstValueFrom(this.taskSvc.createTask(request));
  }

  @Get()
  @ApiOperation({ summary: 'List all tasks' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  async list() {
    const request: Empty = {};
    return await firstValueFrom(this.taskSvc.getAllTasks(request));
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark task as completed' })
  @ApiResponse({ status: 200, description: 'Task completed successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 400, description: 'Task already completed' })
  async complete(@Param('id') id: string) {
    const request: CompleteTaskRequest = { id: Number(id) };
    return await firstValueFrom(this.taskSvc.completeTask(request));
  }
}
