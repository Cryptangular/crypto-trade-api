import { Test, TestingModule } from '@nestjs/testing';
import { BinanceBaseService } from './binance-base.service';

describe('BinanceServiceService', () => {
  let service: BinanceBaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BinanceBaseService],
    }).compile();

    service = module.get<BinanceBaseService>(BinanceBaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
