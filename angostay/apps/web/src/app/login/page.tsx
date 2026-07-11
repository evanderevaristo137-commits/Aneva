import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthCard, OAuthButtons } from '@/components/AuthCard';

export const metadata: Metadata = { title: 'Entrar', robots: { index: false } };

export default function LoginPage() {
  return (
    <AuthCard
      title="Bem-vindo de volta"
      subtitle="Entre para gerir reservas, mensagens e favoritos."
      footer={
        <p>
          Ainda não tem conta?{' '}
          <Link href="/criar-conta" className="font-semibold text-accent-600 hover:underline">Criar conta</Link>
        </p>
      }
    >
      <form className="space-y-4" action="/perfil">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required autoComplete="email" className="input" placeholder="voce@exemplo.ao" />
        </div>
        <div>
          <label className="label" htmlFor="password">Palavra-passe</label>
          <input id="password" type="password" required autoComplete="current-password" className="input" placeholder="••••••••" />
          <Link href="/recuperar-senha" className="mt-1 inline-block text-xs text-accent-600 hover:underline">
            Esqueceu a palavra-passe?
          </Link>
        </div>
        <button type="submit" className="btn-primary w-full">Entrar</button>
      </form>
      <OAuthButtons />
    </AuthCard>
  );
}
