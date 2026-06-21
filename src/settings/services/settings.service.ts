import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BinanceService } from 'src/shared/services/binance-service.service';
import { CipherService } from 'src/shared/services/cipher-service.service';
import { SETTINGS_CODES } from '../constants/constants';
import { SettingsRequestDto } from '../dto/settings.dto';

@Injectable()
export class SettingsService {
  private readonly prismaNotFoundCode = 'P2025';

  constructor(
    private readonly prismaService: PrismaService,
    private readonly cipherService: CipherService,
    private readonly binanceService: BinanceService,
  ) {}

  async getSettings(userId: string) {
    return await this.prismaService.userSettings.findUnique({ where: { userId } });
  }

  async setSettings(userId: string, settingsDto: SettingsRequestDto) {
    const { apiKey, secretKey } = settingsDto;

    const isValid = await this.binanceService.testConnection(apiKey, secretKey);

    if (!isValid) {
      throw new BadRequestException(SETTINGS_CODES.INVALID_KEYS);
    }

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
}
