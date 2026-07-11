import { BadRequestException } from '@nestjs/common';
import { CouponsService } from '../src/modules/coupons/coupons.service';
import { PrismaService } from '../src/prisma/prisma.service';

/** Testes unitários com Prisma simulado (sem base de dados). */
describe('CouponsService', () => {
  const now = Date.now();
  const validCoupon = {
    id: 'c1',
    code: 'BEMVINDO10',
    type: 'PERCENT',
    value: 10,
    minTotalKz: 0,
    maxUses: 100,
    usedCount: 5,
    perUserMax: 1,
    validFrom: new Date(now - 86_400_000),
    validTo: new Date(now + 86_400_000),
    active: true,
  };

  const buildService = (coupon: unknown, redemptions = 0) => {
    const prisma = {
      coupon: { findUnique: jest.fn().mockResolvedValue(coupon) },
      couponRedemption: { count: jest.fn().mockResolvedValue(redemptions) },
    } as unknown as PrismaService;
    return new CouponsService(prisma);
  };

  it('aceita um cupão válido', async () => {
    const service = buildService(validCoupon);
    await expect(service.validateForUse('bemvindo10', 'u1')).resolves.toMatchObject({
      code: 'BEMVINDO10',
    });
  });

  it('rejeita cupão inexistente ou inativo', async () => {
    await expect(buildService(null).validateForUse('X', 'u1')).rejects.toThrow(BadRequestException);
    await expect(
      buildService({ ...validCoupon, active: false }).validateForUse('X', 'u1'),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejeita cupão expirado', async () => {
    const expired = { ...validCoupon, validTo: new Date(now - 1000) };
    await expect(buildService(expired).validateForUse('X', 'u1')).rejects.toThrow(
      'inválido ou expirado',
    );
  });

  it('rejeita cupão esgotado', async () => {
    const exhausted = { ...validCoupon, maxUses: 5, usedCount: 5 };
    await expect(buildService(exhausted).validateForUse('X', 'u1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('respeita o limite por utilizador', async () => {
    const service = buildService(validCoupon, 1);
    await expect(service.validateForUse('X', 'u1')).rejects.toThrow('número máximo');
  });

  it('preview calcula o desconto e valida o mínimo', async () => {
    const service = buildService({ ...validCoupon, minTotalKz: 1_000_000 });
    await expect(service.preview('X', 'u1', 500_000)).rejects.toThrow('mínimo');
    await expect(service.preview('X', 'u1', 2_000_000)).resolves.toMatchObject({
      discountKz: 200_000,
    });
  });
});
