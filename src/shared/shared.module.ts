import { Module } from '@nestjs/common';
import { BinanceService } from './services/binance.service';
import { CipherService } from './services/cipher.service';

@Module({
  providers: [CipherService, BinanceService],
  exports: [CipherService, BinanceService],
})
export class SharedModule {}
