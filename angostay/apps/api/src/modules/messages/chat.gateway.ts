import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';

/**
 * Chat em tempo real hóspede ↔ anfitrião.
 * Autenticação por JWT no handshake; cada conversa é uma sala.
 * Clientes em redes fracas caem para o polling REST (mesma fonte de dados).
 */
@WebSocketGateway({ namespace: '/chat', cors: { origin: true, credentials: true } })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly jwt: JwtService,
    private readonly messages: MessagesService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token ?? client.handshake.headers.authorization?.replace('Bearer ', '');
      const payload = await this.jwt.verifyAsync(token, { secret: process.env.JWT_ACCESS_SECRET });
      if (payload.type !== 'access') throw new UnauthorizedException();
      client.data.userId = payload.sub;
    } catch {
      this.logger.warn(`Ligação recusada: token inválido (${client.id})`);
      client.disconnect(true);
    }
  }

  @SubscribeMessage('conversation.join')
  async join(@ConnectedSocket() client: Socket, @MessageBody() conversationId: string) {
    // listMessages valida a participação (anti-IDOR) antes de entrar na sala.
    await this.messages.listMessages(client.data.userId, conversationId);
    await client.join(`conversation:${conversationId}`);
    return { joined: conversationId };
  }

  @SubscribeMessage('message.send')
  async send(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string; body: string },
  ) {
    const message = await this.messages.send(client.data.userId, payload.conversationId, payload.body);
    this.server.to(`conversation:${payload.conversationId}`).emit('message.new', message);
    return message;
  }
}
