import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentMethod } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentProvider } from './providers/payment-provider.interface';
import {
  AfrimoneyProvider,
  CardGatewayProvider,
  MulticaixaExpressProvider,
  UnitelMoneyProvider,
} from './providers/providers';

@Injectable()
export class PaymentsService {
  private readonly providers: Map<PaymentMethod, PaymentProvider>;

  constructor(private readonly prisma: PrismaService) {
    this.providers = new Map<PaymentMethod, PaymentProvider>([
      [PaymentMethod.MULTICAIXA_EXPRESS, new MulticaixaExpressProvider(process.env.MCX_EXPRESS_WEBHOOK_SECRET ?? '')],
      [PaymentMethod.UNITEL_MONEY, new UnitelMoneyProvider(process.env.UNITEL_MONEY_WEBHOOK_SECRET ?? '')],
      [PaymentMethod.AFRIMONEY, new AfrimoneyProvider(process.env.AFRIMONEY_WEBHOOK_SECRET ?? '')],
      [PaymentMethod.VISA, new CardGatewayProvider(PaymentMethod.VISA, process.env.CARD_GATEWAY_WEBHOOK_SECRET ?? '')],
      [PaymentMethod.MASTERCARD, new CardGatewayProvider(PaymentMethod.MASTERCARD, process.env.CARD_GATEWAY_WEBHOOK_SECRET ?? '')],
    ]);
  }

  async checkout(userId: string, reservationCode: string, method: PaymentMethod, phone?: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { code: reservationCode },
    });
    if (!reservation) throw new NotFoundException('Reserva não encontrada.');
    if (reservation.guestId !== userId) throw new ForbiddenException();
    if (reservation.status !== 'PENDING') {
      throw new BadRequestException('Esta reserva não está a aguardar pagamento.');
    }
    if (reservation.expiresAt && reservation.expiresAt < new Date()) {
      await this.prisma.reservation.update({
        where: { id: reservation.id },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('O prazo de pagamento expirou. Crie uma nova reserva.');
    }

    const provider = this.providers.get(method);
    if (!provider) throw new BadRequestException('Método de pagamento não suportado.');

    const payment = await this.prisma.payment.create({
      data: {
        reservationId: reservation.id,
        method,
        provider: provider.name,
        amountKz: reservation.totalKz,
      },
    });
    const instructions = await provider.createCharge({
      reservationCode,
      amountKz: reservation.totalKz,
      phone,
    });
    return { paymentId: payment.id, ...instructions };
  }

  /**
   * Webhook do provedor: verificação de assinatura + idempotência por providerRef.
   * Confirma a reserva e regista o ledger (cobrança, comissão, repasse pendente).
   */
  async handleWebhook(providerName: string, rawBody: unknown, signature?: string) {
    const provider = [...this.providers.values()].find((p) => p.name === providerName);
    if (!provider) throw new NotFoundException('Provedor desconhecido.');

    const result = provider.parseWebhook(rawBody, signature);

    // Idempotência: um webhook repetido com o mesmo providerRef é ignorado.
    const already = await this.prisma.payment.findUnique({ where: { providerRef: result.providerRef } });
    if (already) return { ok: true, duplicated: true };

    const body = rawBody as { reference?: string };
    const reservation = await this.prisma.reservation.findUnique({
      where: { code: body.reference ?? '' },
      include: { payments: { where: { status: 'PENDING' }, orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    const payment = reservation?.payments[0];
    if (!reservation || !payment) throw new NotFoundException('Pagamento pendente não encontrado.');

    if (result.status === 'FAILED') {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED', providerRef: result.providerRef },
      });
      return { ok: true };
    }

    if (result.amountKz !== reservation.totalKz) {
      throw new BadRequestException('Montante do webhook não corresponde ao total da reserva.');
    }

    const hostCommission = Math.round(
      ((reservation.totalKz - reservation.serviceFeeKz) *
        Number(process.env.HOST_COMMISSION_PERCENT ?? 3)) / 100,
    );
    const payout = reservation.totalKz - reservation.serviceFeeKz - hostCommission;

    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'PAID', providerRef: result.providerRef, paidAt: new Date() },
      }),
      this.prisma.reservation.update({
        where: { id: reservation.id },
        data: { status: 'CONFIRMED', expiresAt: null },
      }),
      // Ledger: cobrança ao hóspede, comissões e repasse (libertado após check-in).
      this.prisma.transaction.createMany({
        data: [
          { paymentId: payment.id, type: 'CHARGE', amountKz: reservation.totalKz, memo: `Cobrança ${reservation.code}` },
          { paymentId: payment.id, type: 'COMMISSION', amountKz: reservation.serviceFeeKz + hostCommission, memo: 'Comissão AngoStay' },
          { paymentId: payment.id, type: 'PAYOUT', amountKz: -payout, memo: 'Repasse ao anfitrião (escrow até check-in)' },
        ],
      }),
      this.prisma.notification.create({
        data: {
          userId: reservation.guestId,
          channel: 'WHATSAPP',
          template: 'reservation_confirmed',
          payload: { code: reservation.code },
        },
      }),
    ]);
    return { ok: true };
  }

  listMine(userId: string) {
    return this.prisma.payment.findMany({
      where: { reservation: { guestId: userId } },
      orderBy: { createdAt: 'desc' },
      include: { reservation: { select: { code: true, property: { select: { title: true } } } } },
    });
  }
}
