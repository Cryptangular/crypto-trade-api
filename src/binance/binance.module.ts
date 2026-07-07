import { Module } from '@nestjs/common';
import { binanceHttpProvider } from './providers/binance-http.provider';
import { BinanceBaseService } from './services/binance-base.service';
import { BinanceSecurityService } from './services/binance-security.service';

@Module({
  imports: [],
  providers: [binanceHttpProvider, BinanceBaseService, BinanceSecurityService],
  exports: [binanceHttpProvider, BinanceBaseService, BinanceSecurityService],
})
export class BinanceModule {}
