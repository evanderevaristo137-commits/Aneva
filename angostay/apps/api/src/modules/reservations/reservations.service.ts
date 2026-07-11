import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ReservationStatus } from '@prisma/client';
import { randomBytes } from 'crypto';
import * as QRCode from 'qrcode';
import { PrismaService } from '../../prisma/prisma.service';
import { CouponsService } from '../coupons/coupons.service';
import { computePricing, refundPercent } from './pricing';
import { CreateReservationDto } from './dto';

const PAYMENT_TTL_MS = 30 * 60_000; // 30 min para pagar

const reservationCode = () =>
  `AS-${randomBytes(4).toString('hex').toUpperCase().slice(0, 6)}`;

@Injectable()
export class ReservationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coupons: CouponsService,
  ) {}

  async create(guestId: string, dto: CreateReservationDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);
    if (checkIn < new Date(new Date().toDateString())) {
      throw new BadRequestException('O check-in não pode ser no passado.');
    }

    const property = await this.prisma.property.findFirst({
      where: { id: dto.propertyId, status: 'ACTIVE', deletedAt: null },
    });
    if (!property) throw new NotFoundException('Imóvel não encontrado ou indisponível.');
    if (property.hostId === guestId) {
      throw new BadRequestException('Não pode reservar o seu próprio imóvel.');
    }
    if (dto.guests > property.maxGuests) {
      throw new BadRequestException(`Este imóvel aceita no máximo ${property.maxGuests} hóspedes.`);
    }

    const coupon = dto.couponCode
      ? await this.coupons.validateForUse(dto.couponCode, guestId)
      : null;

    const pricing = computePricing({
      nightlyPriceKz: property.basePriceKz,
      cleaningFeeKz: property.cleaningFeeKz,
      checkIn,
      checkOut,
      serviceFeePercent: Number(process.env.SERVICE_FEE_PERCENT ?? 10),
      coupon,
    });
    if (coupon && pricing.subtotalKz + pricing.cleaningFeeKz < coupon.minTotalKz) {
      throw new BadRequestException('O total não atinge o mínimo exigido pelo cupão.');
    }

    // Transação serializável + verificação de sobreposição; a exclusion
    // constraint no PostgreSQL é a segunda linha de defesa contra overbooking.
    try {
      return await this.prisma.$transaction(
        async (tx) => {
          const overlapping = await tx.reservation.count({
            where: {
              propertyId: property.id,
              status: { in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] },
              checkIn: { lt: checkOut },
              checkOut: { gt: checkIn },
            },
          });
          const blocked = await tx.availabilityBlock.count({
            where: { propertyId: property.id, startDate: { lt: checkOut }, endDate: { gt: checkIn } },
          });
          if (overlapping > 0 || blocked > 0) {
            throw new ConflictException('Estas datas já não estão disponíveis.');
          }

          const reservation = await tx.reservation.create({
            data: {
              code: reservationCode(),
              guestId,
              propertyId: property.id,
              checkIn,
              checkOut,
              guests: dto.guests,
              nights: pricing.nights,
              nightlyPriceKz: property.basePriceKz,
              cleaningFeeKz: pricing.cleaningFeeKz,
              serviceFeeKz: pricing.serviceFeeKz,
              discountKz: pricing.discountKz,
              totalKz: pricing.totalKz,
              expiresAt: new Date(Date.now() + PAYMENT_TTL_MS),
            },
          });

          if (coupon) {
            await this.coupons.redeem(tx, coupon.id, guestId, reservation.id, pricing.discountKz);
          }
          return reservation;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (e) {
      // Violação da exclusion constraint ou conflito de serialização.
      if (e instanceof ConflictException) throw e;
      if (e instanceof Prisma.PrismaClientKnownRequestError || /exclusion|serializ/i.test(String(e))) {
        throw new ConflictException('Estas datas já não estão disponíveis.');
      }
      throw e;
    }
  }

  async listMine(userId: string, role: 'guest' | 'host', status?: ReservationStatus) {
    const where: Prisma.ReservationWhereInput =
      role === 'host'
        ? { property: { hostId: userId }, ...(status ? { status } : {}) }
        : { guestId: userId, ...(status ? { status } : {}) };

    return this.prisma.reservation.findMany({
      where,
      orderBy: { checkIn: 'desc' },
      include: {
        property: { select: { title: true, slug: true, address: true, photos: { where: { isCover: true }, take: 1 } } },
        guest: { select: { id: true, name: true, avatarUrl: true } },
        payments: { select: { method: true, status: true, paidAt: true } },
      },
    });
  }

  async findByCode(userId: string, code: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { code },
      include: {
        property: { include: { host: { select: { id: true, name: true } }, city: true } },
        payments: true,
      },
    });
    if (!reservation) throw new NotFoundException('Reserva não encontrada.');
    const isParty = reservation.guestId === userId || reservation.property.hostId === userId;
    if (!isParty) throw new ForbiddenException('Sem acesso a esta reserva.');

    // QR Code de check-in (só para reservas confirmadas).
    const qrDataUrl =
      reservation.status === 'CONFIRMED'
        ? await QRCode.toDataURL(`angostay:checkin:${reservation.qrCodeToken}`)
        : null;
    return { ...reservation, qrDataUrl };
  }

  async cancel(userId: string, code: string, reason?: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { code },
      include: { property: true, payments: { where: { status: 'PAID' } } },
    });
    if (!reservation) throw new NotFoundException('Reserva não encontrada.');
    const isGuest = reservation.guestId === userId;
    const isHost = reservation.property.hostId === userId;
    if (!isGuest && !isHost) throw new ForbiddenException();
    if (!['PENDING', 'CONFIRMED'].includes(reservation.status)) {
      throw new BadRequestException('Esta reserva já não pode ser cancelada.');
    }

    // Cancelamento pelo anfitrião → reembolso total; pelo hóspede → política.
    const percent = isHost
      ? 100
      : refundPercent(reservation.property.cancellationPolicy, reservation.checkIn, new Date());
    const paid = reservation.payments.reduce((sum, p) => sum + p.amountKz, 0);
    const refundKz = Math.round((paid * percent) / 100);

    await this.prisma.$transaction(async (tx) => {
      await tx.reservation.update({
        where: { id: reservation.id },
        data: { status: 'CANCELLED', cancelledAt: new Date(), cancelReason: reason },
      });
      for (const payment of reservation.payments) {
        if (refundKz > 0) {
          await tx.payment.update({
            where: { id: payment.id },
            data: { status: refundKz >= payment.amountKz ? 'REFUNDED' : 'PARTIALLY_REFUNDED', refundedAt: new Date() },
          });
          await tx.transaction.create({
            data: { paymentId: payment.id, type: 'REFUND', amountKz: -refundKz, memo: `Reembolso ${percent}% — ${code}` },
          });
        }
      }
    });
    return { cancelled: true, refundPercent: percent, refundKz };
  }

  /** Check-in por QR Code — validado pelo anfitrião. */
  async checkIn(hostId: string, code: string, qrToken: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { code },
      include: { property: true },
    });
    if (!reservation) throw new NotFoundException('Reserva não encontrada.');
    if (reservation.property.hostId !== hostId) throw new ForbiddenException();
    if (reservation.status !== 'CONFIRMED') {
      throw new BadRequestException('A reserva não está confirmada.');
    }
    if (reservation.qrCodeToken !== qrToken) {
      throw new BadRequestException('QR Code inválido.');
    }
    return this.prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: 'CHECKED_IN', checkedInAt: new Date() },
    });
  }
}
