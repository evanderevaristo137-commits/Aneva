import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';

// O envio real (email/SMS/WhatsApp) corre num worker de fila (BullMQ/Redis)
// que consome a tabela notifications — ver docs/02-arquitetura.md §4.1.
@Module({
  controllers: [NotificationsController],
})
export class NotificationsModule {}
