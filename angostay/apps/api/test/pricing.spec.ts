import { computePricing, nightsBetween, refundPercent } from '../src/modules/reservations/pricing';

const d = (iso: string) => new Date(iso);

describe('nightsBetween', () => {
  it('conta noites entre check-in e check-out', () => {
    expect(nightsBetween(d('2026-08-01'), d('2026-08-05'))).toBe(4);
    expect(nightsBetween(d('2026-08-01'), d('2026-08-02'))).toBe(1);
  });
});

describe('computePricing', () => {
  const base = {
    nightlyPriceKz: 4_500_000, // 45.000 Kz
    cleaningFeeKz: 1_000_000, // 10.000 Kz
    checkIn: d('2026-08-01'),
    checkOut: d('2026-08-05'), // 4 noites
    serviceFeePercent: 10,
  };

  it('calcula subtotal, taxa de serviço e total', () => {
    const p = computePricing(base);
    expect(p.nights).toBe(4);
    expect(p.subtotalKz).toBe(18_000_000);
    // base = 18.000.000 + 1.000.000 = 19.000.000 → 10% = 1.900.000
    expect(p.serviceFeeKz).toBe(1_900_000);
    expect(p.discountKz).toBe(0);
    expect(p.totalKz).toBe(20_900_000);
  });

  it('aplica cupão percentual sobre subtotal + limpeza', () => {
    const p = computePricing({ ...base, coupon: { type: 'PERCENT', value: 10 } });
    expect(p.discountKz).toBe(1_900_000);
    expect(p.totalKz).toBe(19_000_000);
  });

  it('aplica cupão fixo sem tornar o total negativo', () => {
    const p = computePricing({ ...base, coupon: { type: 'FIXED', value: 999_999_999 } });
    expect(p.totalKz).toBe(0);
    expect(p.discountKz).toBe(20_900_000);
  });

  it('limita cupões percentuais a 100%', () => {
    const p = computePricing({ ...base, coupon: { type: 'PERCENT', value: 150 } });
    expect(p.discountKz).toBe(19_000_000);
  });

  it('rejeita estadias sem noites', () => {
    expect(() =>
      computePricing({ ...base, checkOut: d('2026-08-01') }),
    ).toThrow('pelo menos 1 noite');
  });

  it('rejeita estadias acima de 365 noites', () => {
    expect(() =>
      computePricing({ ...base, checkOut: d('2027-09-01') }),
    ).toThrow('365');
  });
});

describe('refundPercent', () => {
  const checkIn = d('2026-08-10T14:00:00Z');

  it('FLEXIBLE: 100% até 24h antes, 0% depois', () => {
    expect(refundPercent('FLEXIBLE', checkIn, d('2026-08-08T14:00:00Z'))).toBe(100);
    expect(refundPercent('FLEXIBLE', checkIn, d('2026-08-10T02:00:00Z'))).toBe(0);
  });

  it('MODERATE: 100% até 5 dias antes, 50% depois', () => {
    expect(refundPercent('MODERATE', checkIn, d('2026-08-01T14:00:00Z'))).toBe(100);
    expect(refundPercent('MODERATE', checkIn, d('2026-08-08T14:00:00Z'))).toBe(50);
  });

  it('STRICT: 50% até 7 dias antes, 0% depois', () => {
    expect(refundPercent('STRICT', checkIn, d('2026-08-01T14:00:00Z'))).toBe(50);
    expect(refundPercent('STRICT', checkIn, d('2026-08-08T14:00:00Z'))).toBe(0);
  });

  it('nunca reembolsa após o check-in', () => {
    expect(refundPercent('FLEXIBLE', checkIn, d('2026-08-11T00:00:00Z'))).toBe(0);
  });
});
