export const AppErrors = {
  auth: {
    EMAIL_ALREADY_EXISTS: {
      code: 'AUTH_EMAIL_ALREADY_EXISTS',
      message: 'User with this email already exists',
    },
    INVALID_CREDENTIALS: {
      code: 'AUTH_INVALID_CREDENTIALS',
      message: 'Incorrect email or password',
    },
  },
  network: {
    TOO_MANY_REQUESTS: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please wait a moment.',
    },
    SERVER_DOWN: {
      code: 'SERVER_FAULT',
      message: 'The server is temporarily unavailable.',
    },
  },
} as const;

export type AppErrorCode =
  | (typeof AppErrors.auth)[keyof typeof AppErrors.auth]['code']
  | (typeof AppErrors.network)[keyof typeof AppErrors.network]['code'];

/*
interface ApiResponse {
  status: 'error';
  errorCode: AppErrorCode;
}*/
