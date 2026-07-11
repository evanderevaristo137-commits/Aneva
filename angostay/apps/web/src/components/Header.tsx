'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Globe, Menu, Moon, Sun, X } from 'lucide-react';

const NAV = [
  { href: '/pesquisar', label: 'Pesquisar' },
  { href: '/anfitriao/dashboard', label: 'Anunciar imóvel' },
  { href: '/ajuda', label: 'Ajuda' },
];

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.theme = isDark ? 'dark' : 'light';
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-1 text-xl font-extrabold tracking-tight">
          <span className="text-brand-900 dark:text-white">Ango</span>
          <span className="text-accent-500">Stay</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Principal">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-muted hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button className="btn-ghost !px-3" aria-label="Mudar idioma (PT/EN/FR)" title="PT · EN · FR">
            <Globe size={18} />
          </button>
          <button onClick={toggleTheme} className="btn-ghost !px-3" aria-label="Alternar tema claro/escuro">
            <Sun size={18} className="hidden dark:block" />
            <Moon size={18} className="dark:hidden" />
          </button>
          <Link href="/login" className="btn-ghost">
            Entrar
          </Link>
          <Link href="/criar-conta" className="btn-primary">
            Criar conta
          </Link>
        </div>

        <button className="btn-ghost !px-3 md:hidden" onClick={() => setOpen(!open)} aria-label="Abrir menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-surface px-4 py-4 md:hidden" aria-label="Menu móvel">
          <div className="flex flex-col gap-3">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="text-sm font-medium">
                {item.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="btn-ghost flex-1" onClick={() => setOpen(false)}>
                Entrar
              </Link>
              <Link href="/criar-conta" className="btn-primary flex-1" onClick={() => setOpen(false)}>
                Criar conta
              </Link>
              <button onClick={toggleTheme} className="btn-ghost !px-3" aria-label="Alternar tema">
                <Sun size={18} className="hidden dark:block" />
                <Moon size={18} className="dark:hidden" />
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
