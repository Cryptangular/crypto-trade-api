import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { BinanceService } from 'src/shared/services/binance.service';
import { CipherService } from 'src/shared/services/cipher.service';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: PrismaService,
          useValue: {
            userSettings: {
              findUnique: vi.fn(),
              upsert: vi.fn(),
              delete: vi.fn(),
            },
          },
        },
        {
          provide: CipherService,
          useValue: { encrypt: vi.fn(), decrypt: vi.fn() },
        },
        {
          provide: BinanceService,
          useValue: { testConnection: vi.fn() },
        },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
