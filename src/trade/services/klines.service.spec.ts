import { Test, TestingModule } from '@nestjs/testing';
import { KlinesService } from './klines.service';

describe('KlinesService', () => {
  let service: KlinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KlinesService],
    }).compile();

    service = module.get<KlinesService>(KlinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
