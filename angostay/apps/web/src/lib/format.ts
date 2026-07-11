/** Formatação de valores para o mercado angolano. */

/** Converte centavos de Kz num preço legível: 4_500_000 → "45.000 Kz". */
export function kz(cents: number): string {
  return `${(cents / 100).toLocaleString('pt-AO', { maximumFractionDigits: 0 })} Kz`;
}

export function formatDate(date: string | Date, locale = 'pt-AO'): string {
  return new Date(date).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
