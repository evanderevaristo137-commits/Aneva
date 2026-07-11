import type { Metadata } from 'next';
import { BadgeCheck, Star } from 'lucide-react';
import { PropertyCard } from '@/components/PropertyCard';
import { PROPERTIES } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Perfil do anfitrião — Domingos Cassoma',
  description: 'Conheça o anfitrião e os seus alojamentos verificados na AngoStay.',
};

/** Perfil público do anfitrião. */
export default function HostProfilePage() {
  const hostProperties = PROPERTIES.slice(0, 3);

  return (
    <div className="container-page py-10">
      <div className="card flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-brand-900 text-3xl font-bold text-white">D</div>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            Domingos Cassoma
            <BadgeCheck className="text-emerald-500" size={20} aria-label="Identidade verificada" />
          </h1>
          <p className="mt-1 text-sm text-muted">Anfitrião desde 2024 · Talatona, Luanda</p>
          <p className="mt-2 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1"><Star size={14} className="fill-amber-400 text-amber-400" /> 4.9 · 67 avaliações</span>
            <span>Responde em ~1 h</span>
            <span>Taxa de resposta 98%</span>
          </p>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-bold">Alojamentos de Domingos ({hostProperties.length})</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hostProperties.map((p, i) => (
          <PropertyCard key={p.id} property={p} index={i} />
        ))}
      </div>
    </div>
  );
}
