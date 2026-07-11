import type { Metadata } from 'next';
import { BadgeCheck, ShieldCheck } from 'lucide-react';
import { DashboardShell, USER_NAV } from '@/components/DashboardShell';

export const metadata: Metadata = { title: 'O meu perfil', robots: { index: false } };

export default function ProfilePage() {
  return (
    <DashboardShell title="A minha conta" nav={USER_NAV} active="/perfil">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="font-semibold">Dados pessoais</h2>
          <form className="mt-4 space-y-4">
            <div>
              <label className="label" htmlFor="name">Nome</label>
              <input id="name" className="input" defaultValue="Marta Silva" />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" className="input" defaultValue="guest@angostay.ao" />
            </div>
            <div>
              <label className="label" htmlFor="phone">Telemóvel</label>
              <input id="phone" type="tel" className="input" defaultValue="+244 923 000 000" />
            </div>
            <div>
              <label className="label" htmlFor="locale">Idioma</label>
              <select id="locale" className="input" defaultValue="pt">
                <option value="pt">Português</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>
            <button type="button" className="btn-primary">Guardar alterações</button>
          </form>
        </section>

        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="flex items-center gap-2 font-semibold">
              <BadgeCheck size={18} className="text-emerald-500" /> Verificação de identidade
            </h2>
            <p className="mt-2 text-sm text-muted">
              Submeta BI ou passaporte + selfie para desbloquear o selo de confiança e
              reservas instantâneas.
            </p>
            <button className="btn-secondary mt-4">Iniciar verificação</button>
          </section>

          <section className="card p-6">
            <h2 className="flex items-center gap-2 font-semibold">
              <ShieldCheck size={18} className="text-brand-500" /> Segurança
            </h2>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span>Autenticação em dois passos (2FA)</span>
                <button className="btn-ghost !py-1 !text-xs">Ativar</button>
              </li>
              <li className="flex items-center justify-between">
                <span>Alterar palavra-passe</span>
                <button className="btn-ghost !py-1 !text-xs">Alterar</button>
              </li>
              <li className="flex items-center justify-between">
                <span>Exportar os meus dados (LGPD/GDPR)</span>
                <button className="btn-ghost !py-1 !text-xs">Exportar</button>
              </li>
              <li className="flex items-center justify-between text-red-600">
                <span>Eliminar conta</span>
                <button className="btn-ghost !py-1 !text-xs !text-red-600">Eliminar</button>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
