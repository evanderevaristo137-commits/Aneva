import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Centro de Ajuda',
  description: 'Perguntas frequentes sobre reservas, pagamentos, cancelamentos e segurança na AngoStay.',
};

const FAQ = [
  { q: 'Como pago uma reserva?', a: 'Aceitamos Multicaixa Express, Unitel Money, Afrimoney, Visa e Mastercard. Após reservar tem 30 minutos para concluir o pagamento — no Multicaixa Express recebe um pedido de confirmação diretamente na app.' },
  { q: 'O meu dinheiro está seguro?', a: 'Sim. O valor fica retido pela AngoStay e só é libertado ao anfitrião depois de fazer o check-in. Se o imóvel não corresponder ao anúncio, reportamos e devolvemos.' },
  { q: 'Como funciona o cancelamento?', a: 'Cada imóvel tem uma política (Flexível, Moderada ou Rígida) indicada antes de reservar. O reembolso é automático pelo mesmo método de pagamento em 3–7 dias úteis.' },
  { q: 'O que é um imóvel verificado?', a: 'A nossa equipa confirmou os documentos do imóvel e a identidade do anfitrião (BI/passaporte + selfie). Procure o selo verde "Verificado".' },
  { q: 'Como me torno anfitrião?', a: 'Crie conta, escolha "Anunciar imóveis", complete o assistente de 6 passos e submeta para revisão. É grátis — cobramos apenas uma comissão por reserva concluída.' },
  { q: 'Recebo fatura para a empresa?', a: 'Sim, apart-hotéis e vários anfitriões emitem fatura. Indique o NIF da empresa no momento da reserva.' },
];

export default function HelpPage() {
  return (
    <div className="container-page max-w-3xl py-12">
      {/* Schema.org FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ.map((item) => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
          }),
        }}
      />
      <h1 className="text-3xl font-bold">Centro de Ajuda</h1>
      <p className="mt-2 text-muted">Respostas rápidas às dúvidas mais comuns.</p>

      <div className="mt-8 space-y-3">
        {FAQ.map((item) => (
          <details key={item.q} className="card group p-5">
            <summary className="cursor-pointer font-semibold marker:content-none">
              {item.q}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>

      <div className="card mt-10 p-6 text-center">
        <p className="font-semibold">Não encontrou o que procura?</p>
        <p className="mt-1 text-sm text-muted">A nossa equipa responde em menos de 24 h.</p>
        <Link href="/contacto" className="btn-primary mt-4 inline-flex">Falar connosco</Link>
      </div>
    </div>
  );
}
