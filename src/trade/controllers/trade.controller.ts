import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { BinanceService } from 'src/shared/services/binance.service';
import { CandlestickData } from 'src/shared/types/trade.types';

@Controller('trade')
export class TradeController {
  constructor(private readonly binanceService: BinanceService) {}

  @Get('klines')
  async getKlines(@Query('symbol') symbol: string, @Query('interval') interval: string): Promise<CandlestickData[]> {
    if (!symbol || !interval) {
      throw new BadRequestException('Parameters "symbol" and "interval" are required');
    }

    const rawData = await this.binanceService.getHistoricalKlines(symbol, interval);

    if (!Array.isArray(rawData)) {
      return [];
    }

    return rawData.map(([openTime, open, high, low, close]) => ({
      time: Math.floor(openTime / 1000),
      open: parseFloat(open),
      high: parseFloat(high),
      low: parseFloat(low),
      close: parseFloat(close),
    }));
  }
}
