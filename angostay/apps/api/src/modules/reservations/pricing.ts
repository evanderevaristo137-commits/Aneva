/**
 * Motor de preços de reservas — função pura, coberta por testes unitários.
 * Todos os valores em centavos de Kwanza (Int).
 */

export interface PricingInput {
  nightlyPriceKz: number;
  cleaningFeeKz: number;
  checkIn: Date;
  checkOut: Date;
  /** Percentagem de comissão cobrada ao hóspede (ex.: 10). */
  serviceFeePercent: number;
  coupon?: { type: 'PERCENT' | 'FIXED'; value: number } | null;
}

export interface PricingResult {
  nights: number;
  subtotalKz: number;
  cleaningFeeKz: number;
  serviceFeeKz: number;
  discountKz: number;
  totalKz: number;
}

export const MS_PER_DAY = 86_400_000;

export function nightsBetween(checkIn: Date, checkOut: Date): number {
  const diff = Math.round((checkOut.getTime() - checkIn.getTime()) / MS_PER_DAY);
  return diff;
}

export function computePricing(input: PricingInput): PricingResult {
  const nights = nightsBetween(input.checkIn, input.checkOut);
  if (nights < 1) throw new Error('A estadia deve ter pelo menos 1 noite.');
  if (nights > 365) throw new Error('A estadia não pode exceder 365 noites.');

  const subtotalKz = input.nightlyPriceKz * nights;
  const base = subtotalKz + input.cleaningFeeKz;
  const serviceFeeKz = Math.round((base * input.serviceFeePercent) / 100);

  let discountKz = 0;
  if (input.coupon) {
    discountKz =
      input.coupon.type === 'PERCENT'
        ? Math.round((base * Math.min(input.coupon.value, 100)) / 100)
        : input.coupon.value;
    // O desconto nunca torna o total negativo.
    discountKz = Math.min(discountKz, base + serviceFeeKz);
  }

  return {
    nights,
    subtotalKz,
    cleaningFeeKz: input.cleaningFeeKz,
    serviceFeeKz,
    discountKz,
    totalKz: base + serviceFeeKz - discountKz,
  };
}

/**
 * Política de reembolso em cancelamento, em percentagem (0–100),
 * segundo a política do imóvel e a antecedência.
 */
export function refundPercent(
  policy: 'FLEXIBLE' | 'MODERATE' | 'STRICT',
  checkIn: Date,
  cancelledAt: Date,
): number {
  const hoursBefore = (checkIn.getTime() - cancelledAt.getTime()) / 3_600_000;
  if (hoursBefore <= 0) return 0;

  switch (policy) {
    case 'FLEXIBLE':
      return hoursBefore >= 24 ? 100 : 0;
    case 'MODERATE':
      return hoursBefore >= 120 ? 100 : 50;
    case 'STRICT':
      return hoursBefore >= 168 ? 50 : 0;
  }
}
