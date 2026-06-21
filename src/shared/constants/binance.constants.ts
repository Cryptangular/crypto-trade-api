export const BINANCE_CONFIG = {
  BASE_URL: 'https://testnet.binance.vision',
  TIMEOUT: 5000,
  ENDPOINTS: {
    TIME: '/api/v3/time',
    ACCOUNT: '/api/v3/account',
  },
  HEADERS: {
    API_KEY: 'X-MBX-APIKEY',
  },
} as const;
