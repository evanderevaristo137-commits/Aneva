'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { kz } from '@/lib/format';

const SERVICE_FEE_PERCENT = 10;
const MS_PER_DAY = 86_400_000;

/** Cartão de reserva sticky — cálculo de preço em tempo real (espelha o backend). */
export function BookingCard({ priceKz, maxGuests }: { priceKz: number; maxGuests: number }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const pricing = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    const nights = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / MS_PER_DAY);
    if (nights < 1) return null;
    const subtotal = priceKz * nights;
    const serviceFee = Math.round((subtotal * SERVICE_FEE_PERCENT) / 100);
    return { nights, subtotal, serviceFee, total: subtotal + serviceFee };
  }, [checkIn, checkOut, priceKz]);

  return (
    <aside className="card h-fit p-6 lg:sticky lg:top-24">
      <p className="text-xl font-bold">
        {kz(priceKz)} <span className="text-sm font-normal text-muted">/noite</span>
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div>
          <label className="label" htmlFor="checkin">Check-in</label>
          <input id="checkin" type="date" className="input" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="checkout">Check-out</label>
          <input id="checkout" type="date" className="input" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
        </div>
      </div>

      <label className="label mt-3" htmlFor="guests">Hóspedes</label>
      <select id="guests" className="input" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
        {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>{n} hóspede{n > 1 ? 's' : ''}</option>
        ))}
      </select>

      {pricing && (
        <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">{kz(priceKz)} × {pricing.nights} noites</dt>
            <dd className="tabular-nums">{kz(pricing.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Taxa de serviço ({SERVICE_FEE_PERCENT}%)</dt>
            <dd className="tabular-nums">{kz(pricing.serviceFee)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-2 font-bold">
            <dt>Total</dt>
            <dd className="tabular-nums">{kz(pricing.total)}</dd>
          </div>
        </dl>
      )}

      <button
        className="btn-primary mt-5 w-full"
        disabled={!pricing}
        onClick={() => router.push('/reservas')}
      >
        Reservar
      </button>
      <p className="mt-2 text-center text-xs text-muted">
        Ainda não será cobrado — tem 30 minutos para pagar após reservar.
      </p>
    </aside>
  );
}
