# AngoStay — Pesquisa UX

## 1. Contexto de mercado

Angola tem uma oferta crescente de alojamento (Luanda, Benguela, Lubango, Namibe, Cabinda,
Huambo) mas fragmentada: reservas fazem-se por telefone, WhatsApp e intermediários informais.
As dores principais identificadas:

- **Confiança** — receio de burla ao pagar antecipado; imóveis que não correspondem às fotos.
- **Pagamentos** — cartões internacionais pouco difundidos; predominam Multicaixa Express,
  Unitel Money e Afrimoney; transferências bancárias exigem comprovativo manual.
- **Conectividade** — dados móveis caros e instáveis → app tem de ser leve e tolerante a falhas.
- **Idioma e moeda** — português como língua principal, preços em Kwanza (AOA) com
  referência opcional em USD/EUR para estrangeiros.
- **Endereçamento** — moradas pouco padronizadas → geolocalização e pontos de referência
  são essenciais.

## 2. Personas

| Persona | Perfil | Objetivos | Dores |
| --- | --- | --- | --- |
| **Marta, 29** — turista nacional | Vive em Luanda, viaja a Benguela em feriados | Encontrar casa perto da praia, pagar com Multicaixa Express | Desconfiança, preços inflacionados na chegada |
| **John, 41** — expatriado | Engenheiro de petróleos, contratos de 3–6 meses | Apart-hotel com wifi e gerador, fatura para a empresa | Pagamento internacional, contratos longos |
| **Sr. Domingos, 55** — proprietário | 4 apartamentos em Talatona | Ocupação constante, receber sem calote | Gestão manual de reservas, inquilinos sem verificação |
| **Aisha, 22** — estudante | Universidade em Huambo | Quarto acessível por semestre | Orçamento limitado, segurança |
| **Guest House Kissama** — negócio | 12 quartos em Benguela | Canal de vendas digital, calendário sincronizado | Overbooking, sem presença online |

## 3. Jornadas principais

### Hóspede — reservar
1. Chega à Home (orgânico/social) → pesquisa cidade + datas + hóspedes.
2. Filtra (preço, tipo, comodidades: **gerador**, **água canalizada**, wifi, AC).
3. Compara no mapa → abre detalhes → verifica selo "Imóvel verificado" e avaliações.
4. Reserva → paga (Multicaixa Express por push, ou cartão) → recebe confirmação por
   WhatsApp/SMS + email com QR Code de check-in.
5. Estadia → check-in por QR Code → avaliação pós-estadia.

### Anfitrião — anunciar
1. Cria conta → verificação de identidade (BI/passaporte + selfie).
2. Assistente "Adicionar imóvel" em 6 passos (tipo, localização no mapa, fotos,
   comodidades, preços, regras).
3. Verificação do imóvel (documentos + visita/vídeo) → selo de confiança.
4. Gere calendário, preços sazonais e reservas no dashboard; comunica via chat.
5. Recebe pagamento (repasse após check-in − comissão AngoStay).

## 4. Benchmark

| Plataforma | Forças | Fraquezas no contexto angolano |
| --- | --- | --- |
| Airbnb | UX de referência, confiança, avaliações | Sem Multicaixa/Unitel Money, pouca oferta local |
| Booking.com | Inventário hoteleiro, cancelamento flexível | Pagamento no local → calotes; comissões altas |
| Jumia Travel (descont.) | Conhecia o mercado africano | Operação descontinuada; logística de pagamentos |
| Facebook/WhatsApp | Onde o mercado está hoje | Zero garantias, sem pagamentos, sem avaliações |

**Oportunidade**: UX nível Airbnb + pagamentos móveis angolanos + verificação forte
de identidade e imóvel + comunicação por WhatsApp.

## 5. Princípios de produto

1. **Confiança primeiro** — selos de verificação, avaliações reais, retenção do pagamento
   até ao check-in (escrow), sistema de denúncias.
2. **Mobile-first e leve** — Core Web Vitals excelentes em redes 3G.
3. **Pagamento local** — Multicaixa Express como método primário; cartões para estrangeiros.
4. **Simplicidade** — reservar em ≤ 4 passos; anunciar em ≤ 10 minutos.
5. **Multilíngue** — PT (padrão), EN, FR; preços em AOA com conversão indicativa.

## 6. Métricas de sucesso (North Star + KPIs)

- **North Star**: noites reservadas e pagas / mês.
- Conversão pesquisa → reserva ≥ 3%; taxa de cancelamento < 10%.
- NPS hóspede ≥ 50; tempo médio de resposta do anfitrião < 2 h.
- % imóveis verificados ≥ 80%; fraude confirmada < 0,5% do GMV.
