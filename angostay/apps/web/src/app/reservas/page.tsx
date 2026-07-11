import type { Metadata } from 'next';
import Link from 'next/link';
import { QrCode } from 'lucide-react';
import { DashboardShell, USER_NAV } from '@/components/DashboardShell';
import { DEMO_RESERVATIONS } from '@/lib/mock-data';
import { formatDate, kz } from '@/lib/format';

export const metadata: Metadata = { title: 'As minhas reservas', robots: { index: false } };

const STATUS_LABEL: Record<string, { label: string; class: string }> = {
  CONFIRMED: { label: 'Confirmada', class: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  COMPLETED: { label: 'Concluída', class: 'bg-brand-100 text-brand-700 dark:bg-brand-700/40 dark:text-brand-300' },
  PENDING: { label: 'Aguarda pagamento', class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  CANCELLED: { label: 'Cancelada', class: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
};

export default function ReservationsPage() {
  return (
    <DashboardShell title="A minha conta" nav={USER_NAV} active="/reservas">
      <h2 className="text-xl font-bold">Reservas</h2>

      <div className="mt-6 space-y-4">
        {DEMO_RESERVATIONS.map((reservation) => {
          const status = STATUS_LABEL[reservation.status];
          return (
            <article key={reservation.code} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <div className={`h-24 w-full shrink-0 rounded-xl bg-gradient-to-br sm:w-36 ${reservation.property.gradient}`} />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{reservation.property.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${status.class}`}>{status.label}</span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {formatDate(reservation.checkIn)} → {formatDate(reservation.checkOut)} · Código{' '}
                  <code className="rounded bg-line px-1 font-mono text-xs">{reservation.code}</code>
                </p>
                <p className="mt-1 text-sm font-bold">{kz(reservation.totalKz)}</p>
              </div>
              <div className="flex gap-2">
                {reservation.status === 'CONFIRMED' && (
                  <button className="btn-secondary !text-xs" title="QR Code de check-in">
                    <QrCode size={14} /> Check-in
                  </button>
                )}
                {reservation.status === 'COMPLETED' && (
                  <button className="btn-primary !text-xs">Avaliar estadia</button>
                )}
                <Link href={`/imovel/${reservation.property.slug}`} className="btn-ghost !text-xs">Ver imóvel</Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="card mt-8 p-6 text-sm text-muted">
        <p className="font-semibold text-ink">Precisa de cancelar?</p>
        <p className="mt-1">
          O reembolso segue a política do imóvel (flexível, moderada ou rígida) e é
          devolvido automaticamente pelo mesmo método de pagamento em 3–7 dias úteis.
        </p>
      </div>
    </DashboardShell>
  );
}
