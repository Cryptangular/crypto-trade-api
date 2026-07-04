import { Test, TestingModule } from '@nestjs/testing';
import { BINANCE_HTTP_CLIENT } from 'src/binance/constants/binance.constants';
import { KlinesService } from './klines.service';

describe('KlinesService', () => {
  let service: KlinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KlinesService,
        {
          provide: BINANCE_HTTP_CLIENT,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<KlinesService>(KlinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
