import { Module } from '@nestjs/common';
import axios from 'axios';
import { BINANCE_CONFIG, BINANCE_HTTP_CLIENT } from './constants/binance.constants';
import { BinanceWsGateway } from './gateways/binance-ws.gateway';
import { BinanceBaseService } from './services/binance-base.service';
import { BinanceOrderService } from './services/binance-order.service';
import { BinanceSecurityService } from './services/binance-security.service';

@Module({
  imports: [],
  providers: [
    BinanceBaseService,
    BinanceSecurityService,
    BinanceWsGateway,
    BinanceOrderService,
    {
      provide: BINANCE_HTTP_CLIENT,
      useFactory: () => {
        return axios.create({
          baseURL: BINANCE_CONFIG.BASE_URL,
          timeout: BINANCE_CONFIG.TIMEOUT,
        });
      },
    },
  ],
  exports: [BinanceBaseService, BinanceSecurityService, BinanceWsGateway, BinanceOrderService],
})
export class BinanceModule {}
