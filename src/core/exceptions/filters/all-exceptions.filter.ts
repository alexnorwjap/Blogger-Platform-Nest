import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseBody } from './error-response-body.type';
import { DomainExceptionCode } from './domain-exceptions-code';
import { production } from 'src/main';

@Catch()
export class AllHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const message: string = exception.message || 'Some error occurred';
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody = this.buildResponseBody(request.url, message);

    response.status(status).json(responseBody);
  }

  private buildResponseBody(requestUrl: string, message: string): ErrorResponseBody {
    if (!production) {
      return {
        timestamp: new Date().toISOString(),
        path: requestUrl,
        message,
        extensions: [],
        code: DomainExceptionCode.InternalServerError,
      };
    }

    return {
      timestamp: new Date().toISOString(),
      path: null,
      message: 'Some error occurred',
      extensions: [],
      code: DomainExceptionCode.InternalServerError,
    };
  }
}
