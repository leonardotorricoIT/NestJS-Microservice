import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from './users.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'CreateUser')
  async createUser(data: { username: string; email: string }) {
    const user = await this.userService.createUser(data.username, data.email);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at.toISOString(),
    };
  }

  @GrpcMethod('UserService', 'GetAllUsers')
  async getAllUsers() {
    const users = await this.userService.getAllUsers();
    return {
      users: users.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at.toISOString(),
      })),
    };
  }

  @GrpcMethod('UserService', 'GetUserById')
  async getUserById(data: { id: number }) {
    const user = await this.userService.getUserById(data.id);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at.toISOString(),
    };
  }

  @GrpcMethod('UserService', 'ValidateUser')
  async validateUser(data: { id: number }) {
    const result = await this.userService.validateUser(data.id);
    return {
      exists: result.exists,
      user: result.user
        ? {
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
            created_at: result.user.created_at.toISOString(),
          }
        : null,
    };
  }
}
