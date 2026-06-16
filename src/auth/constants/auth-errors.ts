import { AppError } from 'src/shared/types/error.types';

export const AuthErrors = {
  EMAIL_ALREADY_EXISTS: {
    code: 'AUTH_EMAIL_ALREADY_EXISTS',
    message: 'User with this email already exists',
  },
  INVALID_CREDENTIALS: {
    code: 'AUTH_INVALID_CREDENTIALS',
    message: 'Incorrect email or password',
  },
  ACCESS_TOKEN_EXPIRED: {
    code: 'AUTH_ACCESS_TOKEN_EXPIRED',
    message: 'Access token has expired',
  },
  ACCESS_TOKEN_MISSING: {
    code: 'AUTH_ACCESS_TOKEN_MISSING',
    message: 'Access token is missing',
  },
} as const satisfies Record<string, AppError>;
