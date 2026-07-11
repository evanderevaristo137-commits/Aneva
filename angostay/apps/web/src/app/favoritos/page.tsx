import type { Metadata } from 'next';
import { DashboardShell, USER_NAV } from '@/components/DashboardShell';
import { PropertyCard } from '@/components/PropertyCard';
import { PROPERTIES } from '@/lib/mock-data';

export const metadata: Metadata = { title: 'Favoritos', robots: { index: false } };

export default function FavoritesPage() {
  const favorites = PROPERTIES.slice(0, 3);

  return (
    <DashboardShell title="A minha conta" nav={USER_NAV} active="/favoritos">
      <h2 className="text-xl font-bold">Favoritos</h2>
      <p className="mt-1 text-sm text-muted">{favorites.length} alojamentos guardados.</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {favorites.map((property, i) => (
          <PropertyCard key={property.id} property={property} index={i} />
        ))}
      </div>
    </DashboardShell>
  );
}
