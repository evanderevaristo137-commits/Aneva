import type { Metadata } from 'next';
import { DashboardShell, StatCard } from '@/components/DashboardShell';
import { kz } from '@/lib/format';

export const metadata: Metadata = { title: 'Painel administrativo', robots: { index: false } };

const ADMIN_NAV = [
  { href: '/admin', label: 'Visão geral' },
  { href: '/admin?t=utilizadores', label: 'Utilizadores' },
  { href: '/admin?t=imoveis', label: 'Imóveis' },
  { href: '/admin?t=reservas', label: 'Reservas' },
  { href: '/admin?t=pagamentos', label: 'Pagamentos' },
  { href: '/admin?t=denuncias', label: 'Denúncias' },
  { href: '/admin?t=logs', label: 'Audit logs' },
];

const MODERATION_QUEUE = [
  { type: 'Verificação de identidade', item: 'João M. — BI + selfie', age: 'há 2 h' },
  { type: 'Verificação de imóvel', item: 'Vivenda no Camama — título de propriedade', age: 'há 5 h' },
  { type: 'Denúncia', item: 'Anúncio "T3 no Kilamba" — fotos não correspondem', age: 'há 1 dia' },
  { type: 'Antifraude', item: 'Reserva AS-8P2QLM — cartão de país ≠ IP', age: 'há 1 dia' },
];

/**
 * Painel administrativo (protótipo). Em produção esta área vive num
 * subdomínio autenticado com papel ADMIN/MODERATOR e 2FA obrigatório,
 * consumindo os endpoints /admin/* da API.
 */
export default function AdminPage() {
  return (
    <DashboardShell title="Administração" nav={ADMIN_NAV} active="/admin">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Utilizadores ativos" value="12 480" delta="+840 este mês" />
        <StatCard label="Imóveis ativos" value="1 236" delta="+96" />
        <StatCard label="GMV este mês" value={kz(48_400_000_000)} delta="+22%" />
        <StatCard label="Comissões" value={kz(6_290_000_000)} delta="+19%" />
      </div>

      <section className="card mt-6 p-6">
        <h2 className="font-semibold">Fila de moderação ({MODERATION_QUEUE.length})</h2>
        <ul className="mt-4 divide-y divide-line">
          {MODERATION_QUEUE.map((item) => (
            <li key={item.item} className="flex flex-wrap items-center gap-3 py-3">
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-900 dark:bg-brand-700/40 dark:text-white">
                {item.type}
              </span>
              <span className="flex-1 text-sm">{item.item}</span>
              <span className="text-xs text-muted">{item.age}</span>
              <div className="flex gap-2">
                <button className="btn-primary !py-1 !text-xs">Aprovar</button>
                <button className="btn-ghost !py-1 !text-xs !text-red-600">Rejeitar</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="font-semibold">Sinais antifraude (7 dias)</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li className="flex justify-between"><span>Reservas de alto risco retidas</span><strong className="text-ink">14</strong></li>
            <li className="flex justify-between"><span>Contas suspensas</span><strong className="text-ink">6</strong></li>
            <li className="flex justify-between"><span>Chargebacks</span><strong className="text-ink">2</strong></li>
            <li className="flex justify-between"><span>Fraude confirmada / GMV</span><strong className="text-emerald-600">0,21%</strong></li>
          </ul>
        </section>
        <section className="card p-6">
          <h2 className="font-semibold">Audit log recente</h2>
          <ul className="mt-3 space-y-2 font-mono text-xs text-muted">
            <li>10:42 admin@angostay.ao · property.moderate · aprovado #p_9f2</li>
            <li>10:31 mod1@angostay.ao · identity.review · aprovado #iv_311</li>
            <li>09:58 admin@angostay.ao · payment.refund · AS-1BC3DD (100%)</li>
            <li>09:12 system · reservation.expire · AS-77XK2P (30 min sem pagamento)</li>
          </ul>
        </section>
      </div>
    </DashboardShell>
  );
}
