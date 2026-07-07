import { Test, TestingModule } from '@nestjs/testing';
import { BINANCE_HTTP_CLIENT } from '../constants/binance.constants';
import { BinanceBaseService } from './binance-base.service';

describe('BinanceBaseService', () => {
  let service: BinanceBaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BinanceBaseService,
        {
          provide: BINANCE_HTTP_CLIENT,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<BinanceBaseService>(BinanceBaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
