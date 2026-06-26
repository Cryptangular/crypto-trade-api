import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { SETTINGS_CODES } from '../constants/constants';

@Catch(HttpException)
export class SettingsFilter implements ExceptionFilter {
  private readonly logger = new Logger(SettingsFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const resBody = exception.getResponse();

    this.logger.error(`Status: ${status} | Message: ${JSON.stringify(resBody)}`, exception.stack);

    response.status(status).json({
      data: null,
      code: this.getCode(exception.getResponse()),
    });
  }

  private getCode(res: string | object): string {
    const message = this.extractMessage(res);

    const codes = Object.values(SETTINGS_CODES) as readonly string[];

    if (codes.includes(message)) {
      return message;
    }

    return SETTINGS_CODES.UNKNOWN_ERROR;
  }

  private extractMessage(res: string | object): string {
    if (typeof res === 'string') return res;

    if (res !== null && typeof res === 'object' && 'message' in res && typeof res.message === 'string') {
      const message = res.message;

      if (Array.isArray(message)) {
        return message[0];
      }

      if (typeof message === 'string') {
        return message;
      }
    }

    return '';
  }
}
