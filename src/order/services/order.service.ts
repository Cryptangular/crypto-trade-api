import { Injectable } from '@nestjs/common';
import { BinanceOrderService } from 'src/binance/services/binance-order.service';
import { BinanceOrderBookResponse } from 'src/shared/types/order.types';

@Injectable()
export class OrderService {
  constructor(private readonly binanceOrderService: BinanceOrderService) {}

  async getOrderBookInitialState(symbol: string): Promise<BinanceOrderBookResponse> {
    return await this.binanceOrderService.getOrderBookInitialState(symbol);
  }
}
