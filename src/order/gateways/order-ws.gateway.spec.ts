import { Test, TestingModule } from '@nestjs/testing';
import { OrderWsGateway } from './order-ws.gateway';

describe('OrderWsGateway', () => {
  let gateway: OrderWsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderWsGateway],
    }).compile();

    gateway = module.get<OrderWsGateway>(OrderWsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
