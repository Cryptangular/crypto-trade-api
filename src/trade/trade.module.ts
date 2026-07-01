import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { TradeController } from './controllers/trade.controller';

@Module({
  imports: [SharedModule],
  controllers: [TradeController],
})
export class TradeModule {}
