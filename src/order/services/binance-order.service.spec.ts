import { Test, TestingModule } from '@nestjs/testing';
import { BinanceOrderService } from './binance-order.service';

describe('BinanceOrderService', () => {
  let service: BinanceOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BinanceOrderService],
    }).compile();

    service = module.get<BinanceOrderService>(BinanceOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
