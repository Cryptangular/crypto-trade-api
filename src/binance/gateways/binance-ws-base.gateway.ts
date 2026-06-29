import { Logger } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocket } from 'ws';

export abstract class BinanceWsBaseGateway {
  private readonly logger: Logger = new Logger(this.constructor.name);

  @WebSocketServer() server: Server;

  private activeConnections = new Map<string, WebSocket>();

  abstract setUrl(symbol: string): string;

  abstract handleMessage(symbol: string, data: unknown): void;

  private getClientCount(symbol: string): number {
    const room = this.server.of('api').adapter.rooms.get(symbol.toLowerCase());
    return room ? room.size : 0;
  }

  protected connectToBinance(symbol: string) {
    const sym = symbol.toLowerCase();

    if (this.activeConnections.has(sym)) return;

    const url = this.setUrl(sym);

    const ws = new WebSocket(url);

    this.activeConnections.set(sym, ws);

    ws.on('open', () => {
      this.logger.log('Connected to Binance!');
    });

    ws.on('close', () => {
      this.logger.warn(`Disconnected from Binance: ${sym}`);
      this.activeConnections.delete(sym);
    });

    ws.on('error', (err) => {
      this.logger.error('Error info:', err.message);
    });

    ws.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());

        this.handleMessage(sym, parsed);
      } catch (e) {
        this.logger.error(`Failed to parse Binance data for ${sym}: ${e.message}`);
      }
    });
  }

  protected handleDisconnect(client: Socket) {
    const rooms = Array.from(client.rooms);

    rooms.forEach((room) => {
      if (room !== client.id) {
        const sym = room.toLowerCase();

        if (this.getClientCount(sym) === 0) {
          const ws = this.activeConnections.get(sym);
          if (ws) {
            this.logger.log(`No more clients for ${sym}, closing stream.`);
            ws.close();
          }
        }
      }
    });
  }
}
