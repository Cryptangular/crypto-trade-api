import { Logger, OnModuleDestroy } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocket } from 'ws';
import { BINANCE_CONFIG } from '../config/binance.config';

export abstract class BinanceWsBaseGateway implements OnModuleDestroy {
  protected readonly logger: Logger = new Logger(this.constructor.name);

  @WebSocketServer() server: Server;

  private readonly activeConnections = new Map<string, WebSocket>();

  protected abstract setUrl(symbol: string): string;

  protected abstract handleMessage(symbol: string, data: unknown): void;

  protected connectToBinance(symbol: string) {
    const sym = symbol.toLowerCase();

    if (this.activeConnections.has(sym)) return;

    const url = this.setUrl(sym);

    const ws = new WebSocket(url);

    this.activeConnections.set(sym, ws);

    ws.on('open', () => {
      this.logger.log(`[WS] Connected to Binance stream: ${sym}`);
    });

    ws.on('close', () => {
      this.logger.warn(`[WS] Close Binance stream for: ${sym}`);
      this.activeConnections.delete(sym);
    });

    ws.on('error', (err) => {
      this.logger.error(`[WS] Binance error info for: ${sym}`, err.message);
    });

    ws.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());

        this.handleMessage(sym, parsed);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`[WS] Failed to parse Binance data for ${sym}: ${message}`);
      }
    });
  }

  protected disconnectFromBinanceEmptyRoom(symbol: string): void {
    const sym = symbol.toLowerCase();
    const room = this.server.of(BINANCE_CONFIG.NAMESPACE).adapter.rooms.get(sym);

    if (room?.size) {
      return;
    }

    const ws = this.activeConnections.get(sym);
    if (!ws) {
      return;
    }

    this.logger.log(`[WS] No more clients for ${sym}, closing Binance stream`);
    ws.close();
    this.activeConnections.delete(sym);
  }

  protected handleClientDisconnect(client: Socket) {
    for (const room of client.rooms) {
      if (room === client.id) continue;
      this.disconnectFromBinanceEmptyRoom(room);
    }
  }

  onModuleDestroy(): void {
    for (const [symbol, ws] of this.activeConnections.entries()) {
      this.logger.log(`[WS] Closing Binance WS for ${symbol}`);
      ws.close();
    }
    this.activeConnections.clear();
  }
}
