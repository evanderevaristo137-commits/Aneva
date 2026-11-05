# BEA Consulting · Website

> **Decida com números, não com palpites.**

Website institucional da **BEA Consulting**, consultora financeira em Angola:
contabilidade, fiscalidade, auditoria, gestão financeira, estudos de viabilidade
e acesso ao crédito, para empresas e investidores.

## O que o site inclui

- **Por onde começar**: o cliente escolhe a sua situação (notificação da AGT,
  pedido de crédito, investimento, perdas, contabilidade, factura electrónica) e
  é levado directamente ao serviço certo e ao contacto, com o assunto já escolhido.
- **12 serviços em 3 frentes** (Gestão Financeira · Análise & Financiamento ·
  Fiscalidade, Auditoria & Sistemas), cada um com descrição e pedido de proposta.
- **Porquê a BEA**: 15 verificações no fecho mensal, prazos antes dos da AGT,
  "Submeter não é cumprir" e a rotina diária → trimestral.
- **Método em 8 etapas** e **3 níveis de acompanhamento** (Controlo → Operação →
  Departamento financeiro externo).
- **Faixa da factura electrónica** com contagem decrescente até 1 de Janeiro de 2027.
- **Diagnóstico gratuito** (ficha de diagnóstico, mapa de pendências, plano de trabalho).
- **Simuladores**: VAL/TIR (viabilidade), margem de lucro, ponto de equilíbrio,
  crédito bancário, fluxo de caixa e Imposto Industrial.
- **Centro de Inteligência**: câmbio e commodities actualizados automaticamente
  todos os dias úteis (`assets/data/market.json`).
- **Contacto pelo WhatsApp**: o formulário abre o WhatsApp (936 673 669) com a
  mensagem já escrita, sem precisar de servidor.
- Português / English, modo claro / escuro, barra de acções rápidas no telemóvel,
  acessibilidade (WCAG) e SEO com imagem de partilha.

## Identidade

Cores e tipo de letra retirados dos logos e publicações da BEA:

| Token | Cor |
|---|---|
| Teal (logo) | `#176E74` |
| Teal profundo | `#0F4F53` |
| Âmbar | `#D4943A` |
| Bronze (selo do logo) | `#B27409` |
| Café (texto) | `#27231F` |
| Creme (fundo) | `#F4EEE3` |
| Taupe | `#5A534B` |

Tipo de letra: **Poppins**, alojada no próprio site (`assets/fonts`, licença SIL OFL 1.1).

## Estrutura

```
.
├── index.html               # Página
├── assets/
│   ├── css/styles.css       # Design system
│   ├── js/main.js           # Conteúdo PT/EN, simuladores, interacções
│   ├── data/market.json     # Indicadores de mercado (actualizado pelo bot)
│   ├── fonts/               # Poppins (woff2) + licença OFL
│   └── img/                 # Logos, favicon, imagem de partilha
├── scripts/fetch-market.mjs # Recolha diária de câmbio e commodities
└── .github/workflows/       # Deploy (GitHub Pages) e recolha de dados
```

## Executar localmente

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Editar conteúdos

- **Textos e traduções**: objecto `I18N` e listas `PILLARS`, `ROUTES`, `METHOD`,
  `TIERS`, `INSIGHTS` e `FAQ` em `assets/js/main.js`.
- **WhatsApp**: constante `WA_NUMBER` em `assets/js/main.js` e links `wa.me` em `index.html`.
- **Indicadores manuais** (inflação, taxa directora, LUIBOR, BODIVA): `assets/data/market.json`.

> Os valores do gráfico "Relatório mensal de gestão" são ilustrativos e estão
> assinalados como tal na página.
