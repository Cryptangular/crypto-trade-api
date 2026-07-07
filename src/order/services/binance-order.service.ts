import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BINANCE_CONFIG } from 'src/binance/config/binance.config';
import { BinanceBaseService } from 'src/binance/services/binance-base.service';
import { BinanceOrderBookResponse } from 'src/order/types/order.types';
import { COMMON_ERRORS_CODES } from 'src/shared/constants/common.constants';

@Injectable()
export class BinanceOrderService extends BinanceBaseService {
  async getOrderBookInitialState(
    symbol: string,
    limit = BINANCE_CONFIG.DEFAULTS.LIMIT,
  ): Promise<BinanceOrderBookResponse> {
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
