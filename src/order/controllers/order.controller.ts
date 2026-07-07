import { Controller, Get, Query } from '@nestjs/common';
import { BinanceOrderBookResponse } from 'src/order/types/order.types';
import { GetOrderBookDto } from '../dto/order.dto';
import { OrderService } from '../services/order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('book')
  getOrderBookInitialState(@Query() query: GetOrderBookDto): Promise<BinanceOrderBookResponse> {
    return this.orderService.getOrderBookInitialState(query.symbol);
  }
}
