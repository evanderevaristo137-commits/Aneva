# AngoStay — SEO e Performance

## 1. SEO técnico (implementado em `apps/web`)

- **URLs amigáveis**: `/imovel/t2-moderno-talatona-luanda`, `/pesquisar?cidade=benguela`.
  Slugs únicos gerados do título + cidade; redirects 301 ao renomear.
- **Meta tags**: `generateMetadata` por página — title ≤ 60 chars, description ≤ 155,
  canonical, `hreflang` pt/en/fr.
- **Open Graph / Twitter Cards**: imagem de capa 1200×630 por imóvel, `og:type=website`,
  preço e localização na descrição.
- **Schema.org (JSON-LD)**:
  - Home: `Organization` + `WebSite` com `SearchAction` (sitelinks searchbox);
  - Detalhe do imóvel: `LodgingBusiness`/`Accommodation` + `AggregateRating` + `Offer` (AOA);
  - Avaliações: `Review`; Ajuda: `FAQPage`; breadcrumbs: `BreadcrumbList`.
- **Sitemap** dinâmico (`/sitemap.xml`): páginas estáticas + imóveis ativos + cidades,
  `lastModified` real. **Robots** (`/robots.txt`): bloqueia `/admin`, `/perfil`, `/api`.
- **Conteúdo programático**: páginas por cidade ("Alojamento em Benguela") geradas por ISR —
  título H1 único, texto introdutório, imóveis, FAQs locais.

## 2. Core Web Vitals — orçamentos

| Métrica | Alvo | Como |
| --- | --- | --- |
| LCP | < 2,0 s (3G rápido) | Hero com `next/image` `priority`, AVIF/WebP, CDN, SSR |
| CLS | < 0,05 | Dimensões reservadas em imagens/cartões, skeletons estáveis |
| INP | < 200 ms | Server Components por defeito, JS mínimo, `dynamic()` nos mapas/gráficos |
| TTFB | < 500 ms | ISR/edge cache nas páginas públicas |

## 3. Estratégia de rendering

| Página | Modo |
| --- | --- |
| Home, Sobre, Ajuda, Termos, Privacidade | SSG/ISR (revalidate 1 h) |
| Detalhe do imóvel | ISR (revalidate 10 min) + on-demand revalidation ao editar |
| Resultados de pesquisa | SSR (SEO) + hidratação para filtros client-side |
| Dashboards, mensagens, reservas | CSR autenticado (sem indexação) |

## 4. Performance de aplicação

- **Imagens**: `next/image` (lazy por defeito, blur placeholder), Cloudinary com
  `f_auto,q_auto,w_auto` — versões ≤ 100 KB no cartão.
- **Código**: route-level code splitting automático; `next/dynamic` para mapa, galeria e
  gráficos; bundle inicial alvo < 150 KB gzip.
- **Cache**: Redis na API (pesquisas 60 s, catálogos 1 h, invalidação por evento);
  `stale-while-revalidate` no edge; ETags nas respostas GET.
- **Compressão**: Brotli/gzip no edge e no Nest (`compression`).
- **Fonts**: `next/font` (Inter subset latin, `display: swap`) — zero layout shift.
- **Redes fracas**: retries com backoff no cliente, modo offline-friendly nas páginas de
  reserva (dados críticos em cache), páginas < 500 KB no total.

## 5. Monitorização

- RUM: Vercel Speed Insights / web-vitals → alertas se p75 sair do orçamento.
- Lighthouse CI no pipeline (falha se performance < 90 nas páginas públicas).
- Search Console + logs de crawl; dashboards de indexação por cidade.
