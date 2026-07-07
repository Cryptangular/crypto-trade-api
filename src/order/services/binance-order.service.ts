import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { AxiosInstance } from 'axios';
import { BINANCE_CONFIG } from 'src/binance/config/binance.config';
import { BINANCE_HTTP_CLIENT } from 'src/binance/constants/binance.constants';
import { BinanceBaseService } from 'src/binance/services/binance-base.service';
import { BinanceOrderBookResponse } from 'src/order/types/order.types';
import { COMMON_ERRORS_CODES } from 'src/shared/constants/common.constants';

@Injectable()
export class BinanceOrderService extends BinanceBaseService {
  constructor(@Inject(BINANCE_HTTP_CLIENT) httpClient: AxiosInstance) {
    super(httpClient);
  }

  async getOrderBookInitialState(symbol: string, limit = 100): Promise<BinanceOrderBookResponse> {
    try {
      const { data } = await this.httpClient.get<BinanceOrderBookResponse>(BINANCE_CONFIG.ENDPOINTS.DEPTH, {
        params: {
          symbol: symbol.toUpperCase(),
          limit,
        },
      });

      return data;
    } catch (error) {
      this.logger.error(`Failed to fetch order book for ${symbol}`, error);
      throw new InternalServerErrorException(COMMON_ERRORS_CODES.UNKNOWN_ERROR);
    }
  }
}
