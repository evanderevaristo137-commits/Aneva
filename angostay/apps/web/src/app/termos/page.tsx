import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Condições de utilização da plataforma AngoStay para hóspedes e anfitriões.',
};

export default function TermsPage() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="text-3xl font-bold">Termos de Uso</h1>
      <p className="mt-2 text-sm text-muted">Versão 1.0 · Última atualização: julho de 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-ink">
        <section>
          <h2>1. O serviço</h2>
          <p>A AngoStay é uma plataforma que liga anfitriões (que anunciam alojamentos) a hóspedes (que os reservam). Não somos proprietários nem operadores dos alojamentos; o contrato de estadia é celebrado entre hóspede e anfitrião.</p>
        </section>
        <section>
          <h2>2. Contas</h2>
          <p>Deve ter 18+ anos e fornecer informação verdadeira. É responsável pela segurança da sua conta e por toda a atividade nela realizada. Contas podem ser suspensas por fraude, abuso ou violação destes termos.</p>
        </section>
        <section>
          <h2>3. Reservas e pagamentos</h2>
          <p>Uma reserva fica pendente até ao pagamento (prazo de 30 minutos). O valor é retido pela AngoStay e libertado ao anfitrião após o check-in. Os preços apresentam-se em Kwanza (AOA) e incluem a taxa de serviço indicada antes da confirmação.</p>
        </section>
        <section>
          <h2>4. Cancelamentos e reembolsos</h2>
          <p>Aplicam-se as políticas do imóvel (Flexível, Moderada, Rígida) mostradas antes de reservar. Cancelamentos pelo anfitrião dão direito a reembolso total. Reembolsos são processados pelo método de pagamento original em 3–7 dias úteis.</p>
        </section>
        <section>
          <h2>5. Obrigações do anfitrião</h2>
          <p>Anunciar apenas imóveis que pode legalmente disponibilizar, com fotos e descrição fiéis, manter o calendário atualizado e honrar reservas confirmadas. A AngoStay pode exigir documentos para a verificação do imóvel.</p>
        </section>
        <section>
          <h2>6. Condutas proibidas</h2>
          <p>Fraude, pagamentos fora da plataforma para contornar comissões, discriminação, conteúdo ilegal, assédio nas mensagens e manipulação de avaliações. Violações podem resultar em remoção e comunicação às autoridades.</p>
        </section>
        <section>
          <h2>7. Comissões</h2>
          <p>A AngoStay cobra uma taxa de serviço ao hóspede e uma comissão ao anfitrião, apresentadas de forma transparente antes da confirmação de cada reserva.</p>
        </section>
        <section>
          <h2>8. Responsabilidade e lei aplicável</h2>
          <p>A plataforma é fornecida "como está"; a nossa responsabilidade limita-se ao valor das taxas cobradas na reserva em causa. Estes termos regem-se pela lei angolana, com foro na comarca de Luanda.</p>
        </section>
      </div>
    </div>
  );
}
