import { Module } from '@nestjs/common';
import { BinanceService } from 'src/shared/services/binance.service';
import { TradeController } from './controllers/trade.controller';

@Module({
  controllers: [TradeController],
  providers: [BinanceService],
})
export class TradeModule {}
