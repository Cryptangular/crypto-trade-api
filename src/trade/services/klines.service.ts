import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { BINANCE_CODES, BINANCE_CONFIG } from 'src/binance/constants/binance.constants';
import { BinanceBaseService } from 'src/binance/services/binance-base.service';
import { BinanceKlineRaw } from '../types/trade.types';

@Injectable()
export class KlinesService extends BinanceBaseService {
  async getHistoricalKlines(symbol: string, interval: string): Promise<BinanceKlineRaw[]> {
    try {
      const response = await this.httpClient.get(BINANCE_CONFIG.ENDPOINTS.KLINES, {
        params: {
          symbol: symbol.toUpperCase(),
          interval: interval,
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch klines for ${symbol} (${interval})`,
        error instanceof Error ? error.message : String(error),
      );

      if (axios.isAxiosError(error)) {
        throw new BadRequestException(error.response?.data?.msg || 'Failed to fetch data from Binance');
      }
      throw new InternalServerErrorException(BINANCE_CODES.UNKNOWN_ERROR);
    }
  }
}
