import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString() @IsNotEmpty() username: string;
  @IsEmail() email: string;
}

export class CreateTaskDto {
  @IsString() @IsNotEmpty() title: string;
  @IsOptional() @IsString() description?: string;
  @IsInt() @Min(1) created_by: number;
}
