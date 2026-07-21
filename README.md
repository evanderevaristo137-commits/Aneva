# ANEVA · Inteligência Financeira

> **Onde a inteligência financeira encontra o crescimento empresarial.**

Website institucional premium da **ANEVA** — consultora de Finanças, Contabilidade,
Fiscalidade, Auditoria, Consultoria Empresarial, Planeamento Financeiro e Gestão
Estratégica, com sede em Angola e visão de expansão para toda a África.

Posiciona a ANEVA como uma consultora financeira de referência, capaz de competir
visualmente e estrategicamente com as maiores consultoras internacionais.

## ✨ Destaques

- **Design premium** — minimalista, corporativo e tecnológico. Paleta *emerald ink*
  (`#064E3B`) e *champagne* (`#F8E7C9`), com branco e neutros suaves esverdeados.
- **Centro de Inteligência Financeira** — ticker com indicadores do mercado angolano
  (câmbio, inflação, taxa diretora, LUIBOR, Brent, BODIVA — valores ilustrativos).
- **Painel financeiro interativo** — gráficos de crescimento, fluxo de caixa e
  rentabilidade desenhados em SVG, com gauge de saúde financeira e indicadores-chave.
- **16 serviços** com ícones lineares exclusivos.
- **Simuladores financeiros** funcionais: Margem de Lucro, Ponto de Equilíbrio,
  Empréstimos, Fluxo de Caixa e Simulador Fiscal.
- **Modo claro / escuro** com preferência persistida.
- **Bilingue** — Português 🇦🇴 / English 🇬🇧, alternável em tempo real.
- **Casos de sucesso, blog de insights, centro de recursos e FAQ.**
- **Animações suaves** — scroll cinematográfico, contadores animados, microinterações.
- **Acessibilidade (WCAG)** — skip link, foco visível, `prefers-reduced-motion`,
  navegação por teclado e semântica correta.
- **SEO avançado** — meta tags, Open Graph, dados estruturados JSON-LD, `sitemap.xml`
  e `robots.txt`.
- **Performance** — zero dependências externas, HTML/CSS/JS puro.

## 🗂 Estrutura

```
.
├── index.html            # Página única com todas as secções
├── assets/
│   ├── css/styles.css     # Design system e estilos
│   ├── js/main.js         # i18n, gráficos, simuladores, interações
│   └── img/favicon.svg    # Ícone da marca
├── robots.txt
├── sitemap.xml
└── .nojekyll              # Publicação direta no GitHub Pages
```

## 🚀 Como executar

Não requer build nem dependências. Basta servir a pasta:

```bash
# opção 1 — abrir diretamente
open index.html

# opção 2 — servidor local
python3 -m http.server 8000
# aceder a http://localhost:8000
```

### Publicar no GitHub Pages
Ative o GitHub Pages sobre a branch e a raiz do repositório. O ficheiro `.nojekyll`
garante que os assets são servidos tal como estão.

## 🎨 Personalização

- **Cores e tipografia:** tokens no topo de `assets/css/styles.css` (`:root`).
- **Conteúdos e traduções:** objeto `I18N` em `assets/js/main.js`.
- **Contactos / WhatsApp:** procurar `+244 900 000 000` e `geral@aneva.co.ao`.
- **Indicadores do mercado:** função `renderTicker()` em `main.js`.

> ⚠️ Números de estatísticas, casos e indicadores são **ilustrativos** e devem ser
> substituídos pelos dados reais da ANEVA antes da publicação.
