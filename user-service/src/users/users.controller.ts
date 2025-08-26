import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from './users.service';
import {
  CreateUserRequest,
  User,
  GetUserByIdRequest,
  UsersResponse,
  UserValidationResponse,
  Empty,
} from '../proto/user';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'CreateUser')
  async createUser(data: CreateUserRequest): Promise<User> {
    const user = await this.userService.createUser(data.username, data.email);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.created_at.toISOString(),
    };
  }

  @GrpcMethod('UserService', 'GetAllUsers')
  async getAllUsers(_: Empty): Promise<UsersResponse> {
    const users = await this.userService.getAllUsers();
    return {
      users: users.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at.toISOString(),
      })),
    };
  }

  @GrpcMethod('UserService', 'GetUserById')
  async getUserById(data: GetUserByIdRequest): Promise<User> {
    const user = await this.userService.getUserById(data.id);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.created_at.toISOString(),
    };
  }

  @GrpcMethod('UserService', 'ValidateUser')
  async validateUser(
    data: GetUserByIdRequest,
  ): Promise<UserValidationResponse> {
    const result = await this.userService.validateUser(data.id);
    return {
      exists: result.exists,
      user: result.user
        ? {
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
            createdAt: result.user.created_at.toISOString(),
          }
        : undefined,
    };
  }
}
