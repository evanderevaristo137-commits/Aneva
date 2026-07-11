import { BadRequestException, Injectable } from '@nestjs/common';
import { Coupon, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Valida um cupão para uso por um utilizador. Lança 400 se inválido. */
  async validateForUse(code: string, userId: string): Promise<Coupon> {
    const coupon = await this.prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    const now = new Date();
    const invalid = new BadRequestException('Cupão inválido ou expirado.');

    if (!coupon || !coupon.active) throw invalid;
    if (coupon.validFrom > now || coupon.validTo < now) throw invalid;
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) throw invalid;

    const usedByUser = await this.prisma.couponRedemption.count({
      where: { couponId: coupon.id, userId },
    });
    if (usedByUser >= coupon.perUserMax) {
      throw new BadRequestException('Já utilizou este cupão o número máximo de vezes.');
    }
    return coupon;
  }

  /** Regista o resgate dentro da transação da reserva. */
  async redeem(
    tx: Prisma.TransactionClient,
    couponId: string,
    userId: string,
    reservationId: string,
    discountKz: number,
  ) {
    await tx.couponRedemption.create({ data: { couponId, userId, reservationId, discountKz } });
    await tx.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } });
  }

  /** Pré-validação usada pelo frontend antes de criar a reserva. */
  async preview(code: string, userId: string, totalKz: number) {
    const coupon = await this.validateForUse(code, userId);
    if (totalKz < coupon.minTotalKz) {
      throw new BadRequestException('O total não atinge o mínimo exigido pelo cupão.');
    }
    const discountKz =
      coupon.type === 'PERCENT'
        ? Math.round((totalKz * Math.min(coupon.value, 100)) / 100)
        : Math.min(coupon.value, totalKz);
    return { code: coupon.code, type: coupon.type, value: coupon.value, discountKz };
  }
}
