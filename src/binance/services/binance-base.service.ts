import { Inject, Injectable, Logger } from '@nestjs/common';
import type { AxiosInstance } from 'axios';
import { BINANCE_CONFIG, BINANCE_HTTP_CLIENT } from '../constants/binance.constants';
import { BinanceTimeResponse } from '../types/types';

@Injectable()
export class BinanceBaseService {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(@Inject(BINANCE_HTTP_CLIENT) protected readonly httpClient: AxiosInstance) {}

  protected async getServerTime(): Promise<string> {
    const res = await this.httpClient.get<BinanceTimeResponse>(BINANCE_CONFIG.ENDPOINTS.TIME);
    return res.data.serverTime.toString();
  }
}
