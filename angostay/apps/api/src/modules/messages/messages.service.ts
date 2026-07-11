import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  listConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { OR: [{ guestId: userId }, { hostId: userId }] },
      orderBy: { updatedAt: 'desc' },
      include: {
        guest: { select: { id: true, name: true, avatarUrl: true } },
        host: { select: { id: true, name: true, avatarUrl: true } },
        property: { select: { title: true, slug: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
  }

  /** Abre (ou reutiliza) a conversa hóspede↔anfitrião sobre um imóvel. */
  async openConversation(guestId: string, propertyId: string) {
    const property = await this.prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Imóvel não encontrado.');

    return this.prisma.conversation.upsert({
      where: { guestId_hostId_propertyId: { guestId, hostId: property.hostId, propertyId } },
      update: {},
      create: { guestId, hostId: property.hostId, propertyId },
    });
  }

  async listMessages(userId: string, conversationId: string) {
    await this.assertParticipant(userId, conversationId);
    // Marca como lidas as mensagens recebidas.
    await this.prisma.message.updateMany({
      where: { conversationId, senderId: { not: userId }, readAt: null },
      data: { readAt: new Date() },
    });
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async send(userId: string, conversationId: string, body: string) {
    await this.assertParticipant(userId, conversationId);
    const [message] = await this.prisma.$transaction([
      this.prisma.message.create({ data: { conversationId, senderId: userId, body } }),
      this.prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } }),
    ]);
    return message;
  }

  private async assertParticipant(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conversation) throw new NotFoundException('Conversa não encontrada.');
    if (conversation.guestId !== userId && conversation.hostId !== userId) {
      throw new ForbiddenException('Sem acesso a esta conversa.');
    }
    return conversation;
  }
}
