import Link from 'next/link';
import type { ReactNode } from 'react';

interface NavItem {
  href: string;
  label: string;
}

/** Layout partilhado dos dashboards (anfitrião e utilizador). */
export function DashboardShell({
  title,
  nav,
  active,
  children,
}: {
  title: string;
  nav: NavItem[];
  active: string;
  children: ReactNode;
}) {
  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[220px_1fr]">
      <aside>
        <h1 className="mb-4 text-lg font-bold">{title}</h1>
        <nav className="flex gap-2 overflow-x-auto lg:flex-col" aria-label={title}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium ${
                item.href === active
                  ? 'bg-brand-900 text-white dark:bg-brand-100 dark:text-brand-900'
                  : 'text-muted hover:bg-brand-100 hover:text-brand-900 dark:hover:bg-brand-700/30 dark:hover:text-white'
              }`}
              aria-current={item.href === active ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}

export const HOST_NAV: NavItem[] = [
  { href: '/anfitriao/dashboard', label: 'Visão geral' },
  { href: '/anfitriao/imoveis/novo', label: 'Adicionar imóvel' },
  { href: '/anfitriao/calendario', label: 'Calendário' },
  { href: '/reservas', label: 'Reservas' },
  { href: '/mensagens', label: 'Mensagens' },
  { href: '/pagamentos', label: 'Pagamentos' },
];

export const USER_NAV: NavItem[] = [
  { href: '/perfil', label: 'Perfil' },
  { href: '/reservas', label: 'Reservas' },
  { href: '/favoritos', label: 'Favoritos' },
  { href: '/mensagens', label: 'Mensagens' },
  { href: '/pagamentos', label: 'Pagamentos' },
];

export function StatCard({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
      {delta && <p className="mt-1 text-xs font-medium text-emerald-600">{delta}</p>}
    </div>
  );
}
