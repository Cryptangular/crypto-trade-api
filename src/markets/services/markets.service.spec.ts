import { Test, TestingModule } from '@nestjs/testing';
import { MarketsServiceService } from './markets.service';

describe('MarketsServiceService', () => {
  let service: MarketsServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketsServiceService],
    }).compile();

    service = module.get<MarketsServiceService>(MarketsServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
