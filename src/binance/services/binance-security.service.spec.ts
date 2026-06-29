import { Test, TestingModule } from '@nestjs/testing';
import { BINANCE_HTTP_CLIENT } from '../constants/binance.constants';
import { BinanceSecurityService } from './binance-security.service';

describe('BinanceSecurityService', () => {
  let service: BinanceSecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BinanceSecurityService,
        {
          provide: BINANCE_HTTP_CLIENT,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<BinanceSecurityService>(BinanceSecurityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
