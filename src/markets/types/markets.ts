export interface MarketToken {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: string;
  change24h: string;
  volume24h: string;
  marketCap?: number;
}

export class MarketsResponse {
  data!: MarketToken[];
  total!: number;
  page!: number;
  limit!: number;
}
