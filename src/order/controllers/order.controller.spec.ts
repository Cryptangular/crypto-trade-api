import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../services/order.service';
import { OrderController } from './order.controller';

describe('OrderController', () => {
  let controller: OrderController;

  const mockOrderService = {
    getOrderBookInitialState: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
