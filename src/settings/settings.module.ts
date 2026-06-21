import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BinanceService } from 'src/shared/services/binance-service.service';
import { CipherService } from 'src/shared/services/cipher-service.service';
import { SharedModule } from 'src/shared/shared.module';
import { SettingsController } from './controllers/settings.controller';
import { SettingsService } from './services/settings.service';

@Module({
  imports: [PrismaModule, SharedModule],
  controllers: [SettingsController],
  providers: [SettingsService, CipherService, BinanceService],
})
export class SettingsModule {}
