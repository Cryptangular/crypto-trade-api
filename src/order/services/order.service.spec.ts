import { Test, TestingModule } from '@nestjs/testing';
import { BinanceOrderService } from './binance-order.service';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;

  const mockBinanceOrderService = {
    getOrderBookInitialState: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: BinanceOrderService,
          useValue: mockBinanceOrderService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
