export interface BinanceOrderBookResponse {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}
