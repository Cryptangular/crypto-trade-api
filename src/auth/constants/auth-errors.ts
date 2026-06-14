export const AuthErrors = {
  EMAIL_ALREADY_EXISTS: {
    errorCode: 'AUTH_EMAIL_ALREADY_EXISTS',
    message: 'User with this email already exists',
  },
  INVALID_CREDENTIALS: {
    errorCode: 'AUTH_INVALID_CREDENTIALS',
    message: 'Incorrect email or password',
  },
} as const;
