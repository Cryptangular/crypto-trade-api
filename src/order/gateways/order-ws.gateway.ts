import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { BinanceWsBaseGateway } from 'src/binance/gateways/binance-ws-base.gateway';

@WebSocketGateway({
  cors: true,
  namespace: 'api',
})
export class OrderWsGateway extends BinanceWsBaseGateway {
  setUrl(symbol: string): string {
    return `wss://stream.binance.com:9443/ws/${symbol}@depth@100ms`;
  }

  handleMessage(symbol: string, data: unknown): void {
    this.server.to(symbol).emit('orderBookUpdate', data);
  }

  @SubscribeMessage('subscribeOrderBook')
  handleSubscribe(client: Socket, symbol: string) {
    client.join(symbol.toLowerCase());
    this.connectToBinance(symbol);
  }

  protected handleDisconnect(client: Socket): void {
    super.handleDisconnect(client);
  }
}
