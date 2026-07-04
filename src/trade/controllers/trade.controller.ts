import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { GetKlinesDto } from '../dto/get-klines.dto';
import { KlinesService } from '../services/klines.service';
import { CandlestickData } from '../types/trade.types';

@Controller('trade')
export class TradeController {
  constructor(private readonly klinesService: KlinesService) {}

  @Get('klines')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getKlines(@Query() query: GetKlinesDto): Promise<CandlestickData[]> {
    const { symbol, interval } = query;

    const rawData = await this.klinesService.getHistoricalKlines(symbol, interval);

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
