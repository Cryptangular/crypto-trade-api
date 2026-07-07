import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { BinanceSecurityService } from 'src/binance/services/binance-security.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CipherService } from 'src/shared/services/cipher.service';
import { SETTINGS_CODES } from '../constants/constants';
import { SettingsRequestDto } from '../dto/settings.dto';
import { SettingsResponse } from '../types/types';

@Injectable()
export class SettingsService {
  private readonly prismaNotFoundCode = 'P2025';

  constructor(
    private readonly prismaService: PrismaService,
    private readonly cipherService: CipherService,
    private readonly binanceSecurityService: BinanceSecurityService,
  ) {}

  async getSettings(userId: string) {
    return await this.prismaService.userSettings.findUnique({ where: { userId } });
  }

  async setSettings(userId: string, settingsDto: SettingsRequestDto) {
    const { apiKey, secretKey } = settingsDto;

    try {
      await this.binanceSecurityService.testConnection(apiKey, secretKey);

      const encryptedSecretKey = this.cipherService.encrypt(secretKey);

      return await this.prismaService.userSettings.upsert({
        where: {
          userId,
        },
        update: {
          apiKey,
          secretKey: encryptedSecretKey,
        },
        create: {
          userId,
          apiKey,
          secretKey: encryptedSecretKey,
        },
      });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new BadRequestException(SETTINGS_CODES.INVALID_KEYS);
      }
      throw new InternalServerErrorException(SETTINGS_CODES.UNKNOWN_ERROR);
    }
  }

  async removeSettings(userId: string) {
    try {
      return await this.prismaService.userSettings.delete({
        where: { userId },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === this.prismaNotFoundCode) {
        return;
      }

      throw new InternalServerErrorException(SETTINGS_CODES.REMOVE_FAILED);
    }
  }

  async getConnectionStatus(userId: string): Promise<SettingsResponse<null>> {
    try {
      const settings = await this.getSettings(userId);

      if (!settings) {
        return { code: SETTINGS_CODES.CONNECTION_OFF, data: null };
      }

      const { apiKey, secretKey } = settings;

      const decryptedSecretKey = this.cipherService.decrypt(secretKey);

      await this.binanceSecurityService.testConnection(apiKey, decryptedSecretKey);

      return { code: SETTINGS_CODES.CONNECTION_ON, data: null };
    } catch {
      return { code: SETTINGS_CODES.CONNECTION_OFF, data: null };
    }
  }
}
