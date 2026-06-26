import { BadRequestException, Injectable, ValidationPipe } from '@nestjs/common';
import { SETTINGS_CODES } from '../constants/constants';

@Injectable()
export class SettingsValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: () => {
        return new BadRequestException(SETTINGS_CODES.INVALID_KEYS);
      },
    });
  }
}
