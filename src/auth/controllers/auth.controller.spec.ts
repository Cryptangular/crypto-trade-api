import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
