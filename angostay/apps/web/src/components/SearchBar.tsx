'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Search } from 'lucide-react';

/** Barra de pesquisa principal — destino, datas e nº de hóspedes. */
export function SearchBar({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  function submit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('cidade', city);
    if (checkIn) params.set('checkin', checkIn);
    if (checkOut) params.set('checkout', checkOut);
    params.set('hospedes', String(guests));
    router.push(`/pesquisar?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      role="search"
      className={`card flex flex-col gap-2 p-3 sm:flex-row sm:items-center ${compact ? '' : 'sm:rounded-full sm:px-4'}`}
    >
      <input
        className="input sm:border-0 sm:bg-transparent sm:focus:ring-0"
        placeholder="Onde? Luanda, Benguela…"
        aria-label="Destino"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <div className="hidden h-8 w-px bg-line sm:block" />
      <input
        type="date"
        className="input sm:w-40 sm:border-0 sm:bg-transparent sm:focus:ring-0"
        aria-label="Check-in"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
      />
      <div className="hidden h-8 w-px bg-line sm:block" />
      <input
        type="date"
        className="input sm:w-40 sm:border-0 sm:bg-transparent sm:focus:ring-0"
        aria-label="Check-out"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
      />
      <div className="hidden h-8 w-px bg-line sm:block" />
      <select
        className="input sm:w-36 sm:border-0 sm:bg-transparent sm:focus:ring-0"
        aria-label="Número de hóspedes"
        value={guests}
        onChange={(e) => setGuests(Number(e.target.value))}
      >
        {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
          <option key={n} value={n}>
            {n} hóspede{n > 1 ? 's' : ''}
          </option>
        ))}
      </select>
      <button type="submit" className="btn-primary sm:rounded-full">
        <Search size={16} /> Pesquisar
      </button>
    </form>
  );
}
