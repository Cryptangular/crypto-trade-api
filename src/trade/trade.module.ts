import { Module } from '@nestjs/common';
import { BinanceModule } from 'src/binance/binance.module';
import { SharedModule } from 'src/shared/shared.module';
import { TradeController } from './controllers/trade.controller';
import { KlinesService } from './services/klines.service';

@Module({
  imports: [SharedModule, BinanceModule],
  controllers: [TradeController],
  providers: [KlinesService],
})
export class TradeModule {}
