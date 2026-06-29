import { Test, TestingModule } from '@nestjs/testing';
import { BINANCE_HTTP_CLIENT } from 'src/binance/constants/binance.constants';
import { BinanceOrderService } from './binance-order.service';

describe('BinanceOrderService', () => {
  let service: BinanceOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BinanceOrderService,
        {
          provide: BINANCE_HTTP_CLIENT,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<BinanceOrderService>(BinanceOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
