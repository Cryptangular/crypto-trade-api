import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { BINANCE_CONFIG } from 'src/binance/config/binance.config';
import { BinanceWsBaseGateway } from 'src/binance/gateways/binance-ws-base.gateway';

@WebSocketGateway({
  cors: true,
  namespace: BINANCE_CONFIG.NAMESPACE,
})
export class OrderWsGateway extends BinanceWsBaseGateway implements OnGatewayDisconnect {
  protected setUrl(symbol: string): string {
    return `${BINANCE_CONFIG.WS_BASE_URL}/${symbol}@depth@100ms`;
  }

  protected handleMessage(symbol: string, data: unknown): void {
    this.server.to(symbol).emit('orderBookUpdate', data);
  }

  @SubscribeMessage('subscribeOrderBook')
  handleSubscribe(client: Socket, symbol: string): void {
    const sym = symbol.toLowerCase();
    client.join(sym);
    this.connectToBinance(sym);
  }

  handleDisconnect(client: Socket): void {
    super.handleClientDisconnect(client);
  }
}
