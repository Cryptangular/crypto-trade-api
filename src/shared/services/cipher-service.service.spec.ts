import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CipherService } from './cipher-service.service';

describe('CipherService', () => {
  let service: CipherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CipherService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: vi.fn().mockReturnValue('626bf0fb0d0129d10bdaeeaf0b8789d47d292ac9b5e3f1b3a318fb30857e2674'),
          },
        },
      ],
    }).compile();

    service = module.get<CipherService>(CipherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
