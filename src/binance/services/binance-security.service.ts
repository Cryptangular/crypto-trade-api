import * as crypto from 'node:crypto';
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { BINANCE_CODES, BINANCE_CONFIG } from '../constants/binance.constants';
import { BinanceBaseService } from './binance-base.service';

@Injectable()
export class BinanceSecurityService extends BinanceBaseService {
  private generateSignature(queryString: string, secretKey: string) {
    return crypto.createHmac('sha256', secretKey).update(queryString).digest('hex');
  }

  async testConnection(apiKey: string, secretKey: string): Promise<boolean> {
    try {
      const timestamp = await this.getServerTime();
      const queryString = `timestamp=${timestamp}`;

      const signature = this.generateSignature(queryString, secretKey);

      await this.httpClient.get(BINANCE_CONFIG.ENDPOINTS.ACCOUNT, {
        params: { timestamp, signature },
        headers: { [BINANCE_CONFIG.HEADERS.API_KEY]: apiKey },
      });

      return true;
    } catch (error) {
      this.logger.error('Binance request failed', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new UnauthorizedException(BINANCE_CODES.BINANCE_INVALID_CREDENTIALS);
      }
      throw new InternalServerErrorException(BINANCE_CODES.BINANCE_UNREACHEABLE);
    }
  }
}
