import type { Metadata } from 'next';
import Link from 'next/link';
import { DashboardShell, HOST_NAV, StatCard } from '@/components/DashboardShell';
import { kz } from '@/lib/format';

export const metadata: Metadata = { title: 'Dashboard do anfitrião', robots: { index: false } };

/** Receita mensal (12 meses) para o gráfico de barras — valores demo em centavos. */
const REVENUE = [42, 55, 48, 61, 70, 66, 84, 92, 78, 88, 95, 124].map((v) => v * 1_000_000);
const MONTHS = ['Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];

const ARRIVALS = [
  { guest: 'Marta Silva', property: 'T2 moderno em Talatona', dates: '1–5 Ago', status: 'Confirmada' },
  { guest: 'John Peters', property: 'Apart-hotel na Marginal', dates: '3–17 Ago', status: 'Confirmada' },
  { guest: 'Aisha Bengui', property: 'T2 moderno em Talatona', dates: '9–11 Ago', status: 'Pendente' },
];

export default function HostDashboardPage() {
  const max = Math.max(...REVENUE);

  return (
    <DashboardShell title="Painel do anfitrião" nav={HOST_NAV} active="/anfitriao/dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Reservas este mês" value="12" delta="+3 vs. mês anterior" />
        <StatCard label="Receita este mês" value={kz(124_000_000)} delta="+18%" />
        <StatCard label="Taxa de ocupação" value="68%" delta="+5 p.p." />
        <StatCard label="Avaliação média" value="★ 4.9" />
      </div>

      {/* Gráfico de receita — SVG nativo, sem dependências */}
      <section className="card mt-6 p-6" aria-labelledby="grafico-receita">
        <div className="flex items-center justify-between">
          <h2 id="grafico-receita" className="font-semibold">Receita — últimos 12 meses</h2>
          <span className="text-sm text-muted">Total: {kz(REVENUE.reduce((a, b) => a + b, 0))}</span>
        </div>
        <svg viewBox="0 0 480 160" className="mt-4 w-full" role="img" aria-label="Gráfico de barras da receita mensal">
          {REVENUE.map((value, i) => {
            const height = (value / max) * 120;
            return (
              <g key={MONTHS[i]}>
                <rect
                  x={i * 40 + 8}
                  y={130 - height}
                  width={24}
                  height={height}
                  rx={4}
                  className={i === REVENUE.length - 1 ? 'fill-accent-500' : 'fill-brand-500/60'}
                />
                <text x={i * 40 + 20} y={148} textAnchor="middle" className="fill-current text-[9px] text-muted">
                  {MONTHS[i]}
                </text>
              </g>
            );
          })}
        </svg>
      </section>

      <section className="card mt-6 overflow-x-auto p-6" aria-labelledby="chegadas">
        <div className="flex items-center justify-between">
          <h2 id="chegadas" className="font-semibold">Próximas chegadas</h2>
          <Link href="/reservas" className="text-sm font-semibold text-accent-600 hover:underline">Ver todas →</Link>
        </div>
        <table className="mt-4 w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="py-2 font-medium">Hóspede</th>
              <th className="py-2 font-medium">Imóvel</th>
              <th className="py-2 font-medium">Datas</th>
              <th className="py-2 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {ARRIVALS.map((arrival) => (
              <tr key={arrival.guest + arrival.dates} className="border-b border-line last:border-0">
                <td className="py-3 font-medium">{arrival.guest}</td>
                <td className="py-3 text-muted">{arrival.property}</td>
                <td className="py-3">{arrival.dates}</td>
                <td className="py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    arrival.status === 'Confirmada'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}>
                    {arrival.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/anfitriao/imoveis/novo" className="btn-primary">+ Adicionar imóvel</Link>
        <Link href="/anfitriao/imoveis/p1/editar" className="btn-ghost">Editar preços</Link>
        <Link href="/anfitriao/calendario" className="btn-ghost">Bloquear datas</Link>
      </div>
    </DashboardShell>
  );
}
