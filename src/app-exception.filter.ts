import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { AuthErrors } from 'src/auth/constants/auth-errors';

import { BINANCE_CODES } from 'src/binance/constants/binance.constants';
import { SETTINGS_CODES } from 'src/settings/constants/constants';
import { COMMON_ERRORS_CODES } from 'src/shared/constants/common.constants';

type AppErrorCodes =
  | (typeof SETTINGS_CODES)[keyof typeof SETTINGS_CODES]
  | (typeof BINANCE_CODES)[keyof typeof BINANCE_CODES]
  | (typeof COMMON_ERRORS_CODES)[keyof typeof COMMON_ERRORS_CODES];

@Catch(HttpException)
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  private readonly allCodes = new Set([
    ...Object.values(SETTINGS_CODES),
    ...Object.values(BINANCE_CODES),
    ...Object.values(COMMON_ERRORS_CODES),
    ...Object.values(AuthErrors).map((e) => e.code),
  ]);

  catch(exception: HttpException, host: ArgumentsHost) {
    const resBody = exception.getResponse();
    const status = exception.getStatus();

    this.logger.error(`Status: ${status} | Message: ${JSON.stringify(resBody)}`, exception.stack);

    if (!this.isDomainError(resBody)) {
      throw exception;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse = this.resolveErrorResponse(resBody);

    response.status(status).json({
      data: null,
      ...errorResponse,
    });
  }

  private isDomainError(res: string | object): boolean {
    const code = this.getCode(res);
    return this.allCodes.has(code as AppErrorCodes) && code !== COMMON_ERRORS_CODES.UNKNOWN_ERROR;
  }

  private resolveErrorResponse(res: string | object): { code: string; message?: string } {
    const code = this.getCode(res);

    const authErr = Object.values(AuthErrors).find((e) => e.code === code);

    if (authErr) return authErr;

    return { code };
  }

  private getCode(res: string | object): AppErrorCodes {
    const isErrorWithCode = (val: unknown): val is { code: string } =>
      val !== null && typeof val === 'object' && 'code' in val;

    const isErrorWithMessage = (val: unknown): val is { message: string } =>
      val !== null && typeof val === 'object' && 'message' in val && typeof val.message === 'string';

    let raw: string = '';

    if (typeof res === 'string') {
      raw = res;
    } else if (isErrorWithCode(res)) {
      raw = res.code;
    } else if (isErrorWithMessage(res)) {
      raw = res.message;
    }

    if (Array.isArray(raw)) return COMMON_ERRORS_CODES.UNKNOWN_ERROR;

    return this.allCodes.has(raw as AppErrorCodes) ? (raw as AppErrorCodes) : COMMON_ERRORS_CODES.UNKNOWN_ERROR;
  }
}
