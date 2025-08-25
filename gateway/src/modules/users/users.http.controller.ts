import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { CreateUserDto } from './dto/dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface UserServiceClient {
  CreateUser(data: { username: string; email: string }): Promise<{ user: any }>;
  getAllUsers(data: {}): Promise<{ users: any[] }>;
  getUserById(data: { id: number }): Promise<{ exists: boolean; user?: any }>;
}
@ApiTags('Users')
@Controller('users')
export class UsersHttpController {
  private userSvc: UserServiceClient;

  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userSvc = this.client.getService<UserServiceClient>('UserService');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  create(@Body() dto: CreateUserDto) {
    return this.userSvc.CreateUser(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all users' })
  list() {
    return this.userSvc.getAllUsers({});
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUser(@Param('id') id: string) {
    return this.userSvc.getUserById({ id: Number(id) });
  }
}
