import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { BinanceService } from 'src/shared/services/binance.service';
import { CandlestickData } from 'src/shared/types/trade.types';
import { GetKlinesDto } from '../dto/get-klines.dto';

@Controller('trade')
export class TradeController {
  constructor(private readonly binanceService: BinanceService) {}

  @Get('klines')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getKlines(@Query() query: GetKlinesDto): Promise<CandlestickData[]> {
    const { symbol, interval } = query;

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
