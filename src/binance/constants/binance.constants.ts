export const BINANCE_HTTP_CLIENT = 'BINANCE_HTTP_CLIENT';

export const BINANCE_CONFIG = {
  BASE_URL: 'https://testnet.binance.vision',
  TIMEOUT: 5000,
  ENDPOINTS: {
    TIME: '/api/v3/time',
    ACCOUNT: '/api/v3/account',
    DEPTH: '/api/v3/depth',
    KLINES: 'api/v3/klines',
  },
  HEADERS: {
    API_KEY: 'X-MBX-APIKEY',
  },
  DEFAULTS: {
    LIMIT: 100,
  },
} as const;

export const BINANCE_CODES = {
  BINANCE_INVALID_CREDENTIALS: 'BINANCE_INVALID_CREDENTIALS',
  BINANCE_UNREACHEABLE: 'BINANCE_UNREACHEABLE',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;
