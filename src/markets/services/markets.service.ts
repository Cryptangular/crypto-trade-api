import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { MarketsResponse, MarketToken } from '../types/markets';

interface BinanceSymbol {
  symbol: string;
  status: string;
  baseAsset: string;
  quoteAsset: string;
}

interface BinanceExchangeInfo {
  symbols: BinanceSymbol[];
}

interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
}

@Injectable()
export class MarketsService {
  private readonly logger = new Logger(MarketsService.name);
  private readonly baseUrl = 'https://testnet.binance.vision/api';
  private readonly allowedQuotes = ['USDT'];

  private pairsMetadata = new Map<string, { base: string; quote: string }>();
  private tokensCache: MarketToken[] = [];

  constructor(private readonly httpService: HttpService) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.fetchExchangeInfo();
      await this.fetchInitialMarketData();
    } catch (error) {
      this.logger.error(
        'Critical error during MarketsService initialization',
        error instanceof Error ? error.stack : error,
      );
    }
  }

  getAllTokens(): MarketsResponse {
    return {
      data: this.tokensCache,
    };
  }

  private async fetchExchangeInfo(): Promise<void> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<BinanceExchangeInfo>(`${this.baseUrl}/v3/exchangeInfo`),
      );

      for (const sym of data.symbols) {
        const isTrading = sym.status === 'TRADING';
        const isValidQuote = this.allowedQuotes.includes(sym.quoteAsset);

        if (isTrading && isValidQuote) {
          this.pairsMetadata.set(sym.symbol, {
            base: sym.baseAsset,
            quote: sym.quoteAsset,
          });
        }
      }
      this.logger.log(`Loaded metadata for ${this.pairsMetadata.size} pairs.`);
    } catch (error) {
      this.logger.error('Failed to fetch exchange info', error instanceof Error ? error.stack : error);
      throw error;
    }
  }

  private async fetchInitialMarketData(): Promise<void> {
    if (this.pairsMetadata.size === 0) {
      this.logger.warn('Skipping initial market data fetch: pairsMetadata is empty.');
      return;
    }

    try {
      const { data } = await firstValueFrom(this.httpService.get<BinanceTicker[]>(`${this.baseUrl}/v3/ticker/24hr`));

      this.tokensCache = data
        .filter((ticker) => this.pairsMetadata.has(ticker.symbol))
        .map((ticker) => this.transformTicker(ticker));

      this.logger.log(`Successfully cached ${this.tokensCache.length} USDT pairs.`);
    } catch (error) {
      this.logger.error(
        'Failed to load initial data from Binance REST API',
        error instanceof Error ? error.stack : error,
      );
    }
  }

  private transformTicker(raw: BinanceTicker): MarketToken {
    const meta = this.pairsMetadata.get(raw.symbol);

    const priceNum = parseFloat(raw.lastPrice) || 0;
    const changeNum = parseFloat(raw.priceChangePercent) || 0;
    const volumeNum = Math.round(parseFloat(raw.volume)) || 0;

    return {
      symbol: raw.symbol,
      baseAsset: meta?.base ?? raw.symbol,
      quoteAsset: meta?.quote ?? '',
      price: priceNum.toString(),
      change24h: changeNum.toFixed(2),
      volume24h: volumeNum.toString(),
    };
  }
}
