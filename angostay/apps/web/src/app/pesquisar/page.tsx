import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, SlidersHorizontal } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { PropertyCard } from '@/components/PropertyCard';
import { PROPERTIES } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Pesquisar alojamentos',
  description: 'Pesquise casas, apartamentos e guest houses em Angola por cidade, datas, preço e comodidades.',
};

const FILTERS = ['Preço', 'Tipo de imóvel', 'Quartos', 'Comodidades', 'Só verificados'];

export default function SearchPage({
  searchParams,
}: {
  searchParams: { cidade?: string; hospedes?: string };
}) {
  const term = searchParams.cidade?.toLowerCase() ?? '';
  const results = term
    ? PROPERTIES.filter(
        (p) => p.city.toLowerCase().includes(term) || p.province.toLowerCase().includes(term),
      )
    : PROPERTIES;

  return (
    <div className="container-page py-8">
      <SearchBar compact />

      {/* Filtros */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <SlidersHorizontal size={16} className="text-muted" aria-hidden />
        {FILTERS.map((filter) => (
          <button key={filter} className="btn-ghost !py-1.5 !text-xs">
            {filter}
          </button>
        ))}
        <Link href="/mapa" className="btn-secondary !py-1.5 !text-xs ms-auto">
          <MapPin size={14} /> Ver no mapa
        </Link>
      </div>

      <p className="mt-6 text-sm text-muted">
        {results.length} alojamento{results.length === 1 ? '' : 's'}
        {term ? ` em “${searchParams.cidade}”` : ' em Angola'}
      </p>

      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((property, i) => (
          <PropertyCard key={property.id} property={property} index={i} />
        ))}
      </div>

      {results.length === 0 && (
        <div className="card mt-6 p-10 text-center">
          <p className="font-semibold">Sem resultados para esta pesquisa.</p>
          <p className="mt-1 text-sm text-muted">Tente outra cidade ou remova filtros.</p>
        </div>
      )}
    </div>
  );
}
