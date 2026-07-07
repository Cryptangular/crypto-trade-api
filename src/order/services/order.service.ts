import { Injectable } from '@nestjs/common';
import { BinanceOrderService } from 'src/order/services/binance-order.service';
import { BinanceOrderBookResponse } from 'src/order/types/order.types';

@Injectable()
export class OrderService {
  constructor(private readonly binanceOrderService: BinanceOrderService) {}

  getOrderBookInitialState(symbol: string): Promise<BinanceOrderBookResponse> {
    return this.binanceOrderService.getOrderBookInitialState(symbol);
  }
}
