export const COOKIE_TIME = {
  ACCESS_TOKEN: 15 * 60 * 1000, // 15 минут
  REFRESH_TOKEN: 7 * 24 * 60 * 60 * 1000, // 7 дней
} as const;

export const AUTH_COOKIES = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
} as const;

export const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

export const SECURITY_CONFIG = {
  SALT_ROUNDS_PASSWORD: 12,
  SALT_ROUNDS_REFRESH: 10,
} as const;
