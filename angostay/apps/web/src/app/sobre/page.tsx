import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sobre a AngoStay',
  description: 'A plataforma angolana de reservas de alojamento — a nossa missão, valores e história.',
};

const VALUES = [
  { title: 'Confiança primeiro', text: 'Identidades e imóveis verificados, pagamento retido até ao check-in e avaliações reais.' },
  { title: 'Feito para Angola', text: 'Pagamentos em Kwanza com Multicaixa Express e carteiras móveis, suporte por WhatsApp e filtros que importam — gerador, água, segurança.' },
  { title: 'Crescer com os anfitriões', text: 'Ferramentas profissionais de gestão para famílias, guest houses e hotéis, com comissões justas.' },
];

export default function AboutPage() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="text-3xl font-bold">Sobre a AngoStay</h1>
      <p className="mt-4 leading-relaxed text-muted">
        A AngoStay nasceu em Luanda com uma missão simples: tornar as reservas de
        alojamento em Angola tão fáceis e seguras como em qualquer capital do mundo —
        mas com a nossa realidade no centro: pagamentos em Kwanza, verificação real de
        imóveis e apoio humano.
      </p>
      <p className="mt-4 leading-relaxed text-muted">
        Ligamos turistas nacionais e internacionais, empresários, expatriados,
        estudantes e famílias a milhares de casas, apartamentos, guest houses,
        pensões, apart-hotéis e hotéis em todas as 18 províncias — com a ambição de
        expandir para toda a África.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {VALUES.map((value) => (
          <div key={value.title} className="card p-5">
            <h2 className="font-semibold">{value.title}</h2>
            <p className="mt-2 text-sm text-muted">{value.text}</p>
          </div>
        ))}
      </div>

      <div className="card mt-10 bg-brand-900 p-8 text-center text-white dark:bg-brand-700/40">
        <p className="text-lg font-semibold">Junte-se a nós — como hóspede ou anfitrião.</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/pesquisar" className="btn-primary">Pesquisar estadias</Link>
          <Link href="/criar-conta" className="btn-ghost !bg-white/10 !text-white">Criar conta</Link>
        </div>
      </div>
    </div>
  );
}
