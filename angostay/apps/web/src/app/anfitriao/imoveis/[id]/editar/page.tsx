import type { Metadata } from 'next';
import { DashboardShell, HOST_NAV } from '@/components/DashboardShell';
import { PROPERTIES } from '@/lib/mock-data';

export const metadata: Metadata = { title: 'Editar imóvel', robots: { index: false } };

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const property = PROPERTIES.find((p) => p.id === params.id) ?? PROPERTIES[0];

  return (
    <DashboardShell title="Painel do anfitrião" nav={HOST_NAV} active="/anfitriao/imoveis/novo">
      <h2 className="text-xl font-bold">Editar imóvel</h2>
      <p className="mt-1 text-sm text-muted">{property.title}</p>

      <form className="card mt-6 space-y-4 p-6">
        <div>
          <label className="label" htmlFor="title">Título do anúncio</label>
          <input id="title" className="input" defaultValue={property.title} />
        </div>
        <div>
          <label className="label" htmlFor="description">Descrição</label>
          <textarea id="description" rows={4} className="input" defaultValue={property.description} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="price">Preço/noite (Kz)</label>
            <input id="price" type="number" className="input" defaultValue={property.priceKz / 100} />
          </div>
          <div>
            <label className="label" htmlFor="guests">Máx. hóspedes</label>
            <input id="guests" type="number" className="input" defaultValue={property.guests} />
          </div>
          <div>
            <label className="label" htmlFor="status">Estado</label>
            <select id="status" className="input" defaultValue="ACTIVE">
              <option value="ACTIVE">Ativo</option>
              <option value="DRAFT">Rascunho</option>
              <option value="SUSPENDED">Suspenso</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 border-t border-line pt-4">
          <button type="button" className="btn-primary">Guardar alterações</button>
          <button type="button" className="btn-ghost">Gerir fotos</button>
          <button type="button" className="btn-ghost !text-red-600">Desativar anúncio</button>
        </div>
      </form>
    </DashboardShell>
  );
}
