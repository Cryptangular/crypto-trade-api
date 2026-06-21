import { Module } from '@nestjs/common';
import { BinanceService } from './services/binance-service.service';
import { CipherService } from './services/cipher-service.service';

@Module({
  providers: [CipherService, BinanceService],
  exports: [CipherService, BinanceService],
})
export class SharedModule {}
