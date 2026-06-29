import { Test, TestingModule } from '@nestjs/testing';
import { BinanceWsBaseGateway } from './binance-ws-base.gateway';

describe('BinanceWsGateway', () => {
  let gateway: BinanceWsBaseGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();

    gateway = module.get<BinanceWsBaseGateway>(BinanceWsBaseGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
