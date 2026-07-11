import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BadgeCheck, MapPin, Share2, Star, Users } from 'lucide-react';
import { findProperty, PROPERTIES } from '@/lib/mock-data';
import { kz } from '@/lib/format';
import { BookingCard } from './BookingCard';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return PROPERTIES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const property = findProperty(params.slug);
  if (!property) return { title: 'Imóvel não encontrado' };
  return {
    title: property.title,
    description: `${property.type} em ${property.city} por ${kz(property.priceKz)}/noite. ${property.description.slice(0, 120)}`,
    openGraph: { title: property.title, type: 'website' },
    alternates: { canonical: `/imovel/${property.slug}` },
  };
}

export default function PropertyPage({ params }: Props) {
  const property = findProperty(params.slug);
  if (!property) notFound();

  return (
    <div className="container-page py-8">
      {/* Schema.org do alojamento */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LodgingBusiness',
            name: property.title,
            address: { '@type': 'PostalAddress', addressLocality: property.city, addressCountry: 'AO' },
            aggregateRating: { '@type': 'AggregateRating', ratingValue: property.rating, reviewCount: property.reviews },
            priceRange: `${kz(property.priceKz)}/noite`,
          }),
        }}
      />

      {/* Galeria */}
      <div className="grid gap-2 sm:grid-cols-4 sm:grid-rows-2">
        <div className={`aspect-[4/3] rounded-2xl bg-gradient-to-br sm:col-span-2 sm:row-span-2 sm:aspect-auto ${property.gradient}`} />
        {[0.9, 0.75, 0.6, 0.45].map((opacity, i) => (
          <div key={i} className={`hidden rounded-2xl bg-gradient-to-br sm:block ${property.gradient}`} style={{ opacity }} />
        ))}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{property.title}</h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                <span className="flex items-center gap-1"><MapPin size={14} /> {property.city}, {property.province}</span>
                <span className="flex items-center gap-1"><Star size={14} className="fill-amber-400 text-amber-400" /> {property.rating} ({property.reviews} avaliações)</span>
                <span className="flex items-center gap-1"><Users size={14} /> até {property.guests} hóspedes</span>
              </p>
            </div>
            <div className="flex gap-2">
              {property.verified && (
                <span className="badge-verified"><BadgeCheck size={14} /> Imóvel verificado</span>
              )}
              <button className="btn-ghost !py-1.5 !text-xs" aria-label="Partilhar"><Share2 size={14} /> Partilhar</button>
            </div>
          </div>

          <hr className="my-6 border-line" />

          <section aria-labelledby="descricao">
            <h2 id="descricao" className="text-lg font-semibold">Sobre este alojamento</h2>
            <p className="mt-3 leading-relaxed text-muted">{property.description}</p>
            <p className="mt-3 text-sm text-muted">
              {property.bedrooms} quarto{property.bedrooms > 1 ? 's' : ''} · {property.bathrooms} casa{property.bathrooms > 1 ? 's' : ''} de banho · {property.type}
            </p>
          </section>

          <hr className="my-6 border-line" />

          <section aria-labelledby="comodidades">
            <h2 id="comodidades" className="text-lg font-semibold">Comodidades</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {property.amenities.map((amenity) => (
                <li key={amenity} className="rounded-xl border border-line px-3 py-2 text-sm">{amenity}</li>
              ))}
            </ul>
          </section>

          <hr className="my-6 border-line" />

          <section aria-labelledby="anfitriao-titulo">
            <h2 id="anfitriao-titulo" className="text-lg font-semibold">Anfitrião</h2>
            <div className="mt-3 flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-900 font-bold text-white">D</div>
              <div>
                <p className="font-medium">Domingos Cassoma <BadgeCheck size={14} className="inline text-emerald-500" /></p>
                <p className="text-sm text-muted">Anfitrião desde 2024 · responde em ~1 h</p>
              </div>
              <Link href="/mensagens" className="btn-ghost ms-auto !text-xs">Enviar mensagem</Link>
            </div>
          </section>

          <hr className="my-6 border-line" />

          <section aria-labelledby="politica">
            <h2 id="politica" className="text-lg font-semibold">Política de cancelamento</h2>
            <p className="mt-2 text-sm text-muted">
              <strong>Moderada</strong> — reembolso total até 5 dias antes do check-in; 50% depois disso.
              O pagamento fica retido pela AngoStay e só é libertado ao anfitrião após o seu check-in.
            </p>
          </section>
        </div>

        <BookingCard priceKz={property.priceKz} maxGuests={property.guests} />
      </div>
    </div>
  );
}
