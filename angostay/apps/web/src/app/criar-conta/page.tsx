import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthCard, OAuthButtons } from '@/components/AuthCard';

export const metadata: Metadata = { title: 'Criar conta', robots: { index: false } };

export default function SignupPage() {
  return (
    <AuthCard
      title="Criar conta"
      subtitle="Grátis para hóspedes e anfitriões."
      footer={
        <p>
          Já tem conta?{' '}
          <Link href="/login" className="font-semibold text-accent-600 hover:underline">Entrar</Link>
        </p>
      }
    >
      <form className="space-y-4" action="/perfil">
        <div>
          <label className="label" htmlFor="name">Nome completo</label>
          <input id="name" required autoComplete="name" className="input" placeholder="Ex.: Marta Silva" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required autoComplete="email" className="input" placeholder="voce@exemplo.ao" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Telemóvel</label>
          <input id="phone" type="tel" autoComplete="tel" className="input" placeholder="+244 9XX XXX XXX" />
        </div>
        <div>
          <label className="label" htmlFor="password">Palavra-passe</label>
          <input id="password" type="password" required minLength={8} autoComplete="new-password" className="input" placeholder="Mínimo 8 caracteres" />
        </div>
        <fieldset>
          <legend className="label">Quero…</legend>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm has-[:checked]:border-accent-500">
              <input type="radio" name="role" value="GUEST" defaultChecked /> Reservar estadias
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm has-[:checked]:border-accent-500">
              <input type="radio" name="role" value="HOST" /> Anunciar imóveis
            </label>
          </div>
        </fieldset>
        <label className="flex items-start gap-2 text-xs text-muted">
          <input type="checkbox" required className="mt-0.5" />
          <span>
            Aceito os <Link href="/termos" className="text-accent-600 hover:underline">Termos de Uso</Link> e a{' '}
            <Link href="/privacidade" className="text-accent-600 hover:underline">Política de Privacidade</Link>.
          </span>
        </label>
        <button type="submit" className="btn-primary w-full">Criar conta</button>
      </form>
      <OAuthButtons />
    </AuthCard>
  );
}
