import Link from 'next/link';
import type { ReactNode } from 'react';

/** Moldura partilhada das páginas de autenticação. */
export function AuthCard({ title, subtitle, children, footer }: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="container-page flex justify-center py-16">
      <div className="card w-full max-w-md p-8">
        <Link href="/" className="text-xl font-extrabold">
          <span className="text-brand-900 dark:text-white">Ango</span>
          <span className="text-accent-500">Stay</span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        <div className="mt-6">{children}</div>
        {footer && <div className="mt-6 border-t border-line pt-4 text-sm text-muted">{footer}</div>}
      </div>
    </div>
  );
}

export function OAuthButtons() {
  return (
    <div className="mt-4">
      <div className="relative my-4 text-center text-xs text-muted">
        <span className="relative z-10 bg-surface px-3">ou continue com</span>
        <div className="absolute left-0 top-1/2 -z-0 h-px w-full bg-line" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button className="btn-ghost" type="button">G · Google</button>
        <button className="btn-ghost" type="button">f · Facebook</button>
      </div>
    </div>
  );
}
