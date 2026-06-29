export interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type BinanceKlineRaw = [
  openTime: number,
  open: string,
  high: string,
  low: string,
  close: string,
  volume: string,
  closeTime: number,
  quoteAssetVolume: string,
  tradesCount: number,
  takerBuyBaseAssetVolume: string,
  takerBuyQuoteAssetVolume: string,
  ignore: string,
];
