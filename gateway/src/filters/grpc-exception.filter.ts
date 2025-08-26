import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { status } from '@grpc/grpc-js';

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log('EXCEPTION CAUGHT IN FILTER:', exception);

    let httpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal server error';

    if (exception?.details) {
      message = exception.details;

      switch (exception.code) {
        case status.NOT_FOUND:
          httpStatus = HttpStatus.NOT_FOUND;
          break;
        case status.INVALID_ARGUMENT:
          httpStatus = HttpStatus.BAD_REQUEST;
          break;
        case status.ALREADY_EXISTS:
          httpStatus = HttpStatus.CONFLICT;
          break;
        case status.INTERNAL:
          httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
          break;
        default:
          httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      }
    } else if (exception?.message) {
      message = exception.message;
    }

    const errorResponse = {
      statusCode: httpStatus,
      message,
      error: HttpStatus[httpStatus],
      timestamp: new Date().toISOString(),
    };

    console.log('SENDING ERROR RESPONSE:', errorResponse);

    response.status(httpStatus).json(errorResponse);
  }
}
