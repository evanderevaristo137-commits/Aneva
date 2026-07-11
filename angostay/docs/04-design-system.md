# AngoStay — Design System

Design premium, minimalista, com muito espaço em branco — inspirado no Airbnb,
com identidade angolana. Implementado em `apps/web/tailwind.config.ts` e `globals.css`.

## 1. Marca

- **Nome**: AngoStay. **Tom**: confiável, simples, profissional, caloroso.
- **Logo**: wordmark "Ango**Stay**" com telhado estilizado sobre o "S" (laranja).

## 2. Cores (tokens)

| Token | Light | Dark | Uso |
| --- | --- | --- | --- |
| `brand-900` | `#0A1F44` | `#0A1F44` | Azul-noite — headers, texto forte, hero |
| `brand-700` | `#123568` | `#1B4485` | Links, estados ativos |
| `brand-100` | `#E8EEF9` | `#122A52` | Fundos suaves, chips |
| `accent-500` | `#F97316` | `#FB923C` | Laranja — CTAs, destaques, preço |
| `accent-600` | `#EA580C` | `#F97316` | Hover de CTA |
| `surface` | `#FFFFFF` | `#0B1526` | Fundo de cartões |
| `background` | `#F8FAFC` | `#060D1A` | Fundo da página |
| `ink` | `#0F172A` | `#E2E8F0` | Texto principal |
| `muted` | `#64748B` | `#94A3B8` | Texto secundário |
| `line` | `#E2E8F0` | `#1E293B` | Bordas, divisores |
| `success/warn/danger` | `#16A34A / #D97706 / #DC2626` | idem +claro | Estados |

Contraste mínimo WCAG AA (4.5:1) verificado em ambos os temas.
Dark/Light mode: classe `dark` no `<html>`, preferência persistida em `localStorage`
com fallback para `prefers-color-scheme`.

## 3. Tipografia

- **Família**: `Inter` (variável), fallback `system-ui`.
- Escala: `display 48/56 · h1 36/44 · h2 28/36 · h3 22/30 · body 16/26 · small 14/22 · caption 12/18`.
- Peso: 400 corpo, 600 subtítulos, 700–800 títulos. Números tabulares em preços.

## 4. Espaçamento, raio e sombra

- Grelha de **4 px**: `4 8 12 16 24 32 48 64 96`.
- Raio: `rounded-xl (12px)` inputs/botões, `rounded-2xl (16px)` cartões, `rounded-full` pills.
- Sombras suaves: `card: 0 1px 2px rgb(2 6 23 / .06), 0 8px 24px rgb(2 6 23 / .06)`;
  hover eleva para `0 12px 32px rgb(2 6 23 / .12)`.

## 5. Componentes principais

| Componente | Anatomia / estados |
| --- | --- |
| **Button** | primary (laranja), secondary (azul-noite), ghost, danger; sm/md/lg; loading, disabled |
| **SearchBar** | pill com 4 segmentos (destino, check-in, check-out, hóspedes) + botão laranja |
| **PropertyCard** | foto 4:3 com ♡, título, localização, ★ nota, preço/noite AOA, selo Verificado |
| **Badge** | verified (verde), superhost (azul), promo (laranja), pending (âmbar) |
| **Input/Select/DateRange** | label flutuante, erro inline, foco anel laranja 2px |
| **Modal / Drawer** | overlay `brand-900/60`, animação Framer Motion (fade + scale 0.98) |
| **Tabs / Stepper** | usados nas reservas e no assistente de anúncio |
| **Rating** | estrelas + distribuição por barras; formulário por categorias |
| **Toast** | canto inferior, auto-dismiss 5 s, variantes success/warn/danger |
| **StatCard / Chart** | dashboards — número grande, delta %, sparkline |
| **MapPin** | pill com preço; ativo = laranja invertido |
| **Skeleton** | shimmer nos cartões e listas durante carregamento |

## 6. Movimento (Framer Motion)

- Durações 150–300 ms, easing `easeOut`; entrada de cartões com `stagger` 40 ms.
- Página: fade+slide 8 px. Hero: parallax subtil. Respeita `prefers-reduced-motion`.

## 7. Iconografia e imagem

- Ícones `lucide-react`, traço 1.5 px, 20/24 px.
- Fotos 4:3 nos cartões, 16:9 no hero; `next/image` com AVIF/WebP e placeholders blur.

## 8. Acessibilidade

- Navegação por teclado completa, `focus-visible` sempre visível.
- Landmarks semânticos, `aria-label` nos ícones de ação, skip-link.
- Alvos táteis ≥ 44 px; formulários com erros anunciados (`aria-live`).

## 9. Voz e conteúdo

- Português de Angola, direto e caloroso: "Encontre a sua estadia", "Fale com o anfitrião".
- Preços sempre `45.000 Kz` (espaço fino, sufixo Kz); datas `12 Jul 2026`.
