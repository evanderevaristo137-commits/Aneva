import type { Metadata } from 'next';
import Link from 'next/link';
import { PROPERTIES } from '@/lib/mock-data';
import { kz } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Mapa dos imóveis',
  description: 'Explore os alojamentos AngoStay no mapa de Angola.',
};

/**
 * Vista de mapa. Em produção o retângulo é substituído pelo adaptador de mapas
 * (Google Maps ou OpenStreetMap/Leaflet, via NEXT_PUBLIC_MAPS_PROVIDER) com
 * pins de preço e pesquisa por área visível (bbox).
 */
export default function MapPage() {
  return (
    <div className="container-page grid gap-6 py-8 lg:grid-cols-[380px_1fr]">
      <aside className="order-2 space-y-4 lg:order-1">
        <h1 className="text-xl font-bold">Imóveis no mapa</h1>
        {PROPERTIES.map((p) => (
          <Link key={p.id} href={`/imovel/${p.slug}`} className="card flex gap-4 p-3 hover:shadow-card-hover">
            <div className={`h-20 w-28 shrink-0 rounded-xl bg-gradient-to-br ${p.gradient}`} />
            <div>
              <p className="text-sm font-semibold leading-snug">{p.title}</p>
              <p className="text-xs text-muted">{p.city}, {p.province}</p>
              <p className="mt-1 text-sm font-bold">{kz(p.priceKz)} <span className="font-normal text-muted">/noite</span></p>
            </div>
          </Link>
        ))}
      </aside>

      <div className="order-1 lg:order-2">
        <div className="card relative aspect-[4/3] overflow-hidden bg-brand-100 dark:bg-brand-700/20 lg:sticky lg:top-24 lg:aspect-auto lg:h-[calc(100vh-8rem)]">
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-4xl">🗺️</p>
              <p className="mt-2 font-semibold">Mapa interativo de Angola</p>
              <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
                Google Maps / OpenStreetMap com pins de preço — configurável em
                <code className="mx-1 rounded bg-line px-1">NEXT_PUBLIC_MAPS_PROVIDER</code>
              </p>
            </div>
          </div>
          {/* Pins ilustrativos */}
          {PROPERTIES.slice(0, 4).map((p, i) => (
            <span
              key={p.id}
              className="absolute rounded-full bg-brand-900 px-3 py-1 text-xs font-bold text-white shadow-card"
              style={{ left: `${20 + i * 18}%`, top: `${30 + (i % 2) * 25}%` }}
            >
              {kz(p.priceKz)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
