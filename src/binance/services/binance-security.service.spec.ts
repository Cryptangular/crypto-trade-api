import { Test, TestingModule } from '@nestjs/testing';
import { BinanceSecurityService } from './binance-security.service';

describe('BinanceSecurityService', () => {
  let service: BinanceSecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BinanceSecurityService],
    }).compile();

    service = module.get<BinanceSecurityService>(BinanceSecurityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
