import Link from 'next/link';
import { CalendarCheck, CreditCard, KeyRound, Search } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { PropertyCard } from '@/components/PropertyCard';
import { CITIES, PROPERTIES } from '@/lib/mock-data';

const STEPS = [
  { icon: Search, title: '1. Pesquise', text: 'Filtre por cidade, datas, preço e comodidades como gerador e água.' },
  { icon: CalendarCheck, title: '2. Reserve', text: 'Escolha as datas no calendário de disponibilidade em tempo real.' },
  { icon: CreditCard, title: '3. Pague', text: 'Multicaixa Express, Unitel Money, Afrimoney, Visa ou Mastercard.' },
  { icon: KeyRound, title: '4. Fique', text: 'Check-in com QR Code e apoio 24/7 durante a estadia.' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white">
        <div className="container-page py-20 sm:py-28">
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Encontre a sua estadia em Angola
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">
            Casas, apartamentos e guest houses verificados — pague com Multicaixa
            Express, Unitel Money ou cartão.
          </p>
          <div className="mt-8 max-w-3xl text-ink">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Destinos populares */}
      <section className="container-page py-14">
        <h2 className="text-2xl font-bold">Destinos populares</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CITIES.map((city) => (
            <Link
              key={city.slug}
              href={`/pesquisar?cidade=${city.slug}`}
              className={`card group relative overflow-hidden bg-gradient-to-br ${city.gradient} aspect-[3/2] border-0 p-5 text-white transition-shadow hover:shadow-card-hover`}
            >
              <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0" />
              <div className="relative flex h-full flex-col justify-end">
                <p className="text-lg font-bold">{city.name}</p>
                <p className="text-sm text-white/80">{city.count} alojamentos</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Em destaque */}
      <section className="container-page py-6">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">Em destaque</h2>
          <Link href="/pesquisar" className="text-sm font-semibold text-accent-600 hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROPERTIES.slice(0, 6).map((property, i) => (
            <PropertyCard key={property.id} property={property} index={i} />
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="container-page py-14">
        <h2 className="text-center text-2xl font-bold">Como funciona</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.title} className="card p-6 text-center">
              <step.icon className="mx-auto text-accent-500" size={28} aria-hidden />
              <h3 className="mt-3 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA anfitrião */}
      <section className="container-page pb-6">
        <div className="card overflow-hidden bg-brand-900 p-10 text-white sm:p-14 dark:bg-brand-700/40">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold">Tem um imóvel? Torne-se anfitrião</h2>
            <p className="mt-3 text-white/80">
              Anuncie grátis, defina os seus preços e receba com segurança — o pagamento
              só é libertado após o check-in do hóspede.
            </p>
            <Link href="/anfitriao/imoveis/novo" className="btn-primary mt-6">
              Começar a anunciar
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
