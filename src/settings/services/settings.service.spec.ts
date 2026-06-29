import { Test, TestingModule } from '@nestjs/testing';
import { BinanceBaseService } from 'src/binance/services/binance-base.service';
import { BinanceSecurityService } from 'src/binance/services/binance-security.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CipherService } from 'src/shared/services/cipher.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;
  const mockPrismaService = {
    userSettings: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      delete: vi.fn(),
    },
  };
  const mockCipherService = {
    encrypt: vi.fn(),
  };
  const mockBinanceSecurityService = {
    testConnection: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CipherService, useValue: mockCipherService },
        { provide: BinanceSecurityService, useValue: mockBinanceSecurityService },
        {
          provide: CipherService,
          useValue: { encrypt: vi.fn(), decrypt: vi.fn() },
        },
        {
          provide: BinanceBaseService,
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
