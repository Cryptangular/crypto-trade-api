import * as crypto from 'node:crypto';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { SETTINGS_CODES } from 'src/settings/constants/constants';
import { BINANCE_CONFIG } from '../constants/binance.constants';
import { BinanceKlineRaw } from '../types/trade.types';

@Injectable()
export class BinanceService {
  private readonly logger = new Logger(BinanceService.name);
  private readonly baseUrl = BINANCE_CONFIG.BASE_URL;
  private readonly httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      timeout: BINANCE_CONFIG.TIMEOUT,
    });
  }

  private generateSignature(queryString: string, secretKey: string) {
    return crypto.createHmac('sha256', secretKey).update(queryString).digest('hex');
  }

  async testConnection(apiKey: string, secretKey: string): Promise<boolean> {
    try {
      const timeRes = await this.httpClient.get(BINANCE_CONFIG.ENDPOINTS.TIME);
      const serverTime = timeRes.data.serverTime;

      const timestamp = serverTime.toString();
      const queryString = `timestamp=${timestamp}`;

      const signature = this.generateSignature(queryString, secretKey);

      await this.httpClient.get(BINANCE_CONFIG.ENDPOINTS.ACCOUNT, {
        params: { timestamp, signature },
        headers: { [BINANCE_CONFIG.HEADERS.API_KEY]: apiKey },
      });

      return true;
    } catch (error) {
      this.logger.error('Binance connection failed', error instanceof Error ? error.message : String(error));

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new BadRequestException(SETTINGS_CODES.INVALID_KEYS);
        }
        throw new InternalServerErrorException(SETTINGS_CODES.UNKNOWN_ERROR);
      }
      throw new InternalServerErrorException(SETTINGS_CODES.UNKNOWN_ERROR);
    }
  }

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
      throw new InternalServerErrorException(SETTINGS_CODES.UNKNOWN_ERROR);
    }
  }
}
