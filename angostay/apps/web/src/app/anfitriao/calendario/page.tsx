import type { Metadata } from 'next';
import { DashboardShell, HOST_NAV } from '@/components/DashboardShell';

export const metadata: Metadata = { title: 'Calendário de disponibilidade', robots: { index: false } };

/** Estado demo de julho de 2026: r = reservado, b = bloqueado. */
const BOOKED = new Set([3, 4, 5, 11, 12, 18, 19, 20, 21]);
const BLOCKED = new Set([25, 26]);
const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export default function CalendarPage() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const firstWeekday = 2; // 1 Jul 2026 = quarta-feira (offset segunda-based)

  return (
    <DashboardShell title="Painel do anfitrião" nav={HOST_NAV} active="/anfitriao/calendario">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Calendário — Julho 2026</h2>
        <div className="flex gap-2">
          <button className="btn-ghost !text-xs">← Junho</button>
          <button className="btn-ghost !text-xs">Agosto →</button>
          <button className="btn-secondary !text-xs">Bloquear datas</button>
        </div>
      </div>

      <div className="card mt-6 p-6">
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-muted">
          {WEEKDAYS.map((d) => <div key={d}>{d}</div>)}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-2">
          {Array.from({ length: firstWeekday }).map((_, i) => <div key={`empty-${i}`} />)}
          {days.map((day) => {
            const state = BOOKED.has(day) ? 'reservado' : BLOCKED.has(day) ? 'bloqueado' : 'livre';
            return (
              <button
                key={day}
                className={`aspect-square rounded-xl border text-sm font-medium transition-colors ${
                  state === 'reservado'
                    ? 'border-accent-500 bg-accent-500/15 text-accent-600'
                    : state === 'bloqueado'
                      ? 'border-line bg-line text-muted line-through'
                      : 'border-line hover:border-brand-500'
                }`}
                aria-label={`${day} de julho — ${state}`}
              >
                {day}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex gap-6 text-xs text-muted">
          <span><span className="mr-1 inline-block h-3 w-3 rounded bg-accent-500/40 align-middle" /> Reservado</span>
          <span><span className="mr-1 inline-block h-3 w-3 rounded bg-line align-middle" /> Bloqueado</span>
          <span><span className="mr-1 inline-block h-3 w-3 rounded border border-line align-middle" /> Disponível</span>
        </div>
      </div>

      <div className="card mt-6 p-6">
        <h3 className="font-semibold">Preços por temporada</h3>
        <p className="mt-1 text-sm text-muted">Defina preços diferentes para épocas altas (feriados, Carnaval, cacimbo).</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <input className="input" type="date" aria-label="Início" />
          <input className="input" type="date" aria-label="Fim" />
          <input className="input" type="number" placeholder="Preço/noite (Kz)" aria-label="Preço por noite" />
        </div>
        <button className="btn-primary mt-4">Aplicar preço sazonal</button>
      </div>
    </DashboardShell>
  );
}
