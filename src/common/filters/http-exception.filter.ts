import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponseBody {
  code: number;
  success: false;
  message: string;
}

function normalizeMessage(message: unknown): string {
  if (Array.isArray(message)) {
    return message.join('；');
  }

  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  return '服务器内部错误';
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 500;
    let message = '服务器内部错误';
    // TODO
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = status;

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseBody = exceptionResponse as {
          code?: number;
          message?: string | string[];
          error?: string;
        };

        if (responseBody.code !== undefined) {
          code = responseBody.code;
        }

        message = normalizeMessage(
          responseBody.message ?? responseBody.error ?? message,
        );
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    const errorResponse: ErrorResponseBody = {
      code,
      success: false,
      message,
    };

    response.status(status).json(errorResponse);
  }
}
