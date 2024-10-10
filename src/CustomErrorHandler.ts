import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Format the message for validation errors
    let message = 'Internal server error';
    if (typeof exceptionResponse === 'object' && exceptionResponse['message']) {
      // Handle validation error case (i.e., remove unnecessary fields)
      message = Array.isArray(exceptionResponse['message'])
        ? exceptionResponse['message'].join(', ')  // Join the validation messages into a single string
        : exceptionResponse['message'];
    } else {
      message = exceptionResponse as string;
    }

    // Customize error response structure
    response.status(status).json({
      status,
      message,
    });
  }
}
