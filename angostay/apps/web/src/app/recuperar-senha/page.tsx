import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthCard } from '@/components/AuthCard';

export const metadata: Metadata = { title: 'Recuperar palavra-passe', robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Recuperar palavra-passe"
      subtitle="Enviaremos um link de recuperação válido por 15 minutos."
      footer={
        <p>
          Lembrou-se?{' '}
          <Link href="/login" className="font-semibold text-accent-600 hover:underline">Voltar ao login</Link>
        </p>
      }
    >
      <form className="space-y-4" action="/login">
        <div>
          <label className="label" htmlFor="email">Email da conta</label>
          <input id="email" type="email" required autoComplete="email" className="input" placeholder="voce@exemplo.ao" />
        </div>
        <button type="submit" className="btn-primary w-full">Enviar link de recuperação</button>
        <p className="text-xs text-muted">
          Por segurança, a resposta é a mesma quer a conta exista ou não.
        </p>
      </form>
    </AuthCard>
  );
}
