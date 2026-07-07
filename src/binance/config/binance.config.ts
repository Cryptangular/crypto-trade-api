export const BINANCE_CONFIG = {
  BASE_URL: 'https://testnet.binance.vision',
  TIMEOUT: 5000,
  ENDPOINTS: {
    TIME: '/api/v3/time',
    ACCOUNT: '/api/v3/account',
    DEPTH: '/api/v3/depth',
    KLINES: '/api/v3/klines',
  },
  HEADERS: {
    API_KEY: 'X-MBX-APIKEY',
  },
  DEFAULTS: {
    LIMIT: 100,
  },
} as const;
