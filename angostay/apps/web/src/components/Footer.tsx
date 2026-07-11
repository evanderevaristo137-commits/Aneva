import Link from 'next/link';

const COLUMNS = [
  {
    title: 'AngoStay',
    links: [
      { href: '/sobre', label: 'Sobre nós' },
      { href: '/contacto', label: 'Contacto' },
      { href: '/ajuda', label: 'Centro de ajuda' },
    ],
  },
  {
    title: 'Hospedagem',
    links: [
      { href: '/anfitriao/dashboard', label: 'Torne-se anfitrião' },
      { href: '/anfitriao/imoveis/novo', label: 'Anunciar imóvel' },
      { href: '/ajuda', label: 'Boas práticas' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/termos', label: 'Termos de Uso' },
      { href: '/privacidade', label: 'Política de Privacidade' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-extrabold">
            <span className="text-brand-900 dark:text-white">Ango</span>
            <span className="text-accent-500">Stay</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            Reservas de alojamento em Angola — simples, seguras e em Kwanzas.
          </p>
          <p className="mt-4 text-sm text-muted">🇦🇴 PT · 🇬🇧 EN · 🇫🇷 FR</p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-sm font-semibold">{col.title}</h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-sm text-muted hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} AngoStay · Luanda, Angola · Todos os direitos reservados.
      </div>
    </footer>
  );
}
