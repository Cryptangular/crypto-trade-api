import { Module } from '@nestjs/common';
import { BinanceModule } from 'src/binance/binance.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SharedModule } from 'src/shared/shared.module';
import { SettingsController } from './controllers/settings.controller';
import { SettingsService } from './services/settings.service';

@Module({
  imports: [PrismaModule, BinanceModule, SharedModule],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
