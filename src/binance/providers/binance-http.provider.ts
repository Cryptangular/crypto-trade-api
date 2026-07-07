import { Provider } from '@nestjs/common';
import axios from 'axios';
import { BINANCE_CONFIG } from '../config/binance.config';
import { BINANCE_HTTP_CLIENT } from '../constants/binance.constants';

export const binanceHttpProvider: Provider = {
  provide: BINANCE_HTTP_CLIENT,
  useFactory: () => {
    return axios.create({
      baseURL: BINANCE_CONFIG.BASE_URL,
      timeout: BINANCE_CONFIG.TIMEOUT,
    });
  },
};
