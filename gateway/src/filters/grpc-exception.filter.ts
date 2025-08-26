import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Catch(RpcException)
export class GrpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const error = exception.getError();

    let httpStatus: HttpStatus;
    let message: string;

    if (typeof error === 'object' && error !== null && 'code' in error) {
      switch (error.code) {
        case status.NOT_FOUND:
          httpStatus = HttpStatus.NOT_FOUND;
          break;
        case status.ALREADY_EXISTS:
          httpStatus = HttpStatus.CONFLICT;
          break;
        case status.INVALID_ARGUMENT:
          httpStatus = HttpStatus.BAD_REQUEST;
          break;
        case status.INTERNAL:
          httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
          break;
        case status.UNAUTHENTICATED:
          httpStatus = HttpStatus.UNAUTHORIZED;
          break;
        case status.PERMISSION_DENIED:
          httpStatus = HttpStatus.FORBIDDEN;
          break;
        default:
          httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      }
      message = (error as any)?.message || 'Internal server error';
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    response.status(httpStatus).json({
      statusCode: httpStatus,
      message,
      error: HttpStatus[httpStatus],
      timestamp: new Date().toISOString(),
    });
  }
}
