import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  OnModuleInit,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreateUserDto } from './dto/dto';
import {
  UserServiceClient,
  CreateUserRequest,
  GetUserByIdRequest,
  Empty,
} from '../../proto/user'; // 👈 import del proto generado

@ApiTags('Users')
@Controller('users')
export class UsersHttpController implements OnModuleInit {
  private userSvc: UserServiceClient;

  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userSvc = this.client.getService<UserServiceClient>('UserService');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  create(@Body() dto: CreateUserDto) {
    const request: CreateUserRequest = {
      username: dto.username,
      email: dto.email,
    };
    return this.userSvc.createUser(request);
  }

  @Get()
  @ApiOperation({ summary: 'List all users' })
  list() {
    const request: Empty = {};
    return this.userSvc.getAllUsers(request);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUser(@Param('id') id: string) {
    const request: GetUserByIdRequest = { id: Number(id) };
    return this.userSvc.getUserById(request);
  }
}
