export interface MarketToken {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap?: number;
}

export class MarketsResponse {
  data!: MarketToken[];
  total!: number;
  page!: number;
  limit!: number;
}
