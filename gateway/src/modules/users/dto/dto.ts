import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Leo', description: 'Unique username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'Leo@mail.com', description: 'Valid email' })
  @IsEmail()
  email: string;
}

export class CreateTaskDto {
  @ApiProperty({ example: 'Clean bedroom' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'The bedroom are very bad', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the user who creates the task',
  })
  @IsInt()
  @Min(1)
  created_by: number;
}
