import { Module } from '@nestjs/common';
import { BinanceModule } from 'src/binance/binance.module';
import { SharedModule } from 'src/shared/shared.module';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';

@Module({
  imports: [SharedModule, BinanceModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
