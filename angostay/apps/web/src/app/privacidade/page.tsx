import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como a AngoStay recolhe, usa e protege os seus dados pessoais (LGPD/GDPR).',
};

export default function PrivacyPage() {
  return (
    <div className="container-page prose-sm max-w-3xl py-12">
      <h1 className="text-3xl font-bold">Política de Privacidade</h1>
      <p className="mt-2 text-sm text-muted">Versão 1.0 · Última atualização: julho de 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-ink">
        <section>
          <h2>1. Quem somos</h2>
          <p>A AngoStay ("nós") opera a plataforma de reservas de alojamento angostay.ao. Somos o responsável pelo tratamento dos dados pessoais descritos nesta política, em conformidade com a legislação angolana de proteção de dados (Lei n.º 22/11) e, quando aplicável, o RGPD/LGPD.</p>
        </section>
        <section>
          <h2>2. Dados que recolhemos</h2>
          <p>Conta (nome, email, telefone), verificação de identidade (documento e selfie — cifrados), dados de reservas e pagamentos (nunca guardamos números completos de cartões), mensagens trocadas na plataforma, e dados técnicos (IP, dispositivo) para segurança e antifraude.</p>
        </section>
        <section>
          <h2>3. Para que usamos</h2>
          <p>Executar reservas e pagamentos, verificar identidades e imóveis, prevenir fraude, prestar suporte, cumprir obrigações legais e fiscais e, com o seu consentimento, enviar comunicações de marketing (pode retirar o consentimento a qualquer momento).</p>
        </section>
        <section>
          <h2>4. Partilha</h2>
          <p>Partilhamos apenas o necessário com: anfitriões/hóspedes da sua reserva, processadores de pagamento (Multicaixa Express, Unitel Money, Afrimoney, gateways de cartões), fornecedores de armazenamento e comunicações — todos vinculados por contratos de proteção de dados. Nunca vendemos os seus dados.</p>
        </section>
        <section>
          <h2>5. Os seus direitos</h2>
          <p>Aceder, retificar, exportar (portabilidade) e eliminar os seus dados, além de opor-se ou limitar tratamentos. Pode exercê-los em Perfil → Segurança ou escrevendo para privacidade@angostay.ao. A eliminação da conta anonimiza os dados em 30 dias, preservando registos financeiros exigidos por lei.</p>
        </section>
        <section>
          <h2>6. Segurança e retenção</h2>
          <p>Usamos encriptação em trânsito (TLS) e em repouso, controlo de acessos, registos de auditoria e cópias de segurança. Conservamos dados apenas pelo tempo necessário às finalidades ou obrigações legais.</p>
        </section>
        <section>
          <h2>7. Contacto</h2>
          <p>Encarregado de Proteção de Dados: privacidade@angostay.ao · Talatona, Luanda, Angola.</p>
        </section>
      </div>
    </div>
  );
}
