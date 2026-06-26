export type OrderBookItem = {
  price: string;
  quantity: string;
};

export interface BinanceOrderBookResponse {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

export type BinanceOrderBook = {
  lastUpdateId: number;
  bids: OrderBookItem[];
  asks: OrderBookItem[];
};
