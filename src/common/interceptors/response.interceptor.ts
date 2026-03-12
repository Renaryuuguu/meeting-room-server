import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface SuccessResponse<T> {
  code: number;
  success: true;
  message: string;
  data: T;
}

function isWrappedResponse(
  value: unknown,
): value is { code: number; success: boolean } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'success' in value
  );
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  T | SuccessResponse<T>
> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T | SuccessResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        if (isWrappedResponse(data)) {
          return data;
        }
        return {
          code: 200,
          success: true,
          message: '操作成功',
          data,
        };
      }),
    );
  }
}
