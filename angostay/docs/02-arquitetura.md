# AngoStay — Arquitetura do Sistema

## 1. Visão geral

Arquitetura **monólito modular** (NestJS) com fronteiras de domínio claras, pronta a ser
extraída para microserviços quando a escala o justificar. Frontend desacoplado (Next.js)
consumindo a API REST.

```
                        ┌─────────────────────────────┐
   Utilizadores ───────▶│  CDN / Edge (Vercel)        │
                        │  Next.js — SSR/ISR/SSG      │
                        └──────────────┬──────────────┘
                                       │ HTTPS (REST/JSON)
                        ┌──────────────▼──────────────┐
                        │  API Gateway / NestJS       │
                        │  ─ Auth (JWT/OAuth/2FA)     │
                        │  ─ Properties / Search      │
                        │  ─ Reservations / Calendar  │
                        │  ─ Payments (gateway plug.) │
                        │  ─ Messaging (WebSocket)    │
                        │  ─ Reviews / Favorites      │
                        │  ─ Notifications (fila)     │
                        │  ─ Admin / Moderation       │
                        └───┬──────────┬──────────┬───┘
                            │          │          │
                 ┌──────────▼───┐ ┌────▼─────┐ ┌──▼──────────────┐
                 │ PostgreSQL 16│ │ Redis 7  │ │ Storage         │
                 │ (Prisma ORM) │ │ cache +  │ │ Cloudinary/S3   │
                 │              │ │ filas +  │ │ (upload assinado│
                 │              │ │ rate-lim │ │  + CDN imagens) │
                 └──────────────┘ └──────────┘ └─────────────────┘
                            │
        ┌───────────────────┼───────────────────────────┐
        ▼                   ▼                           ▼
  Pagamentos           Notificações                 Mapas
  Multicaixa Express   Email (SES/SMTP)             Google Maps
  Unitel Money         SMS (gateway local)          OpenStreetMap
  Afrimoney            WhatsApp Business API        (adaptador)
  Visa/Mastercard
```

## 2. Decisões de arquitetura (ADR resumido)

| # | Decisão | Racional |
| --- | --- | --- |
| 1 | Monólito modular NestJS | Time-to-market; módulos com fronteiras que permitem extração futura |
| 2 | PostgreSQL + Prisma | Relacional forte (reservas/pagamentos exigem ACID); migrations versionadas |
| 3 | Redis | Cache de pesquisa, sessões de refresh token, rate limiting, filas (BullMQ) |
| 4 | Pagamentos via **PaymentProvider** (Strategy) | Cada método (Multicaixa, Unitel, Afrimoney, cartões) é um adaptador; webhooks idempotentes |
| 5 | Next.js App Router | SSR para SEO das páginas públicas, ISR para listagens, CSR nos dashboards |
| 6 | REST + OpenAPI | Simplicidade, cacheável, documentação Swagger gerada |
| 7 | WebSocket (Socket.IO) para chat | Tempo real com fallback a polling em redes fracas |
| 8 | Outbox + filas para notificações | Email/SMS/WhatsApp assíncronos, com retries e DLQ |

## 3. Domínios (bounded contexts)

- **Identity** — utilizadores, papéis/permissões (RBAC), OAuth, 2FA, verificação de identidade.
- **Catalog** — imóveis, fotos, comodidades, cidades, verificação de imóvel, pesquisa.
- **Booking** — disponibilidade, reservas, cancelamentos, política de reembolso.
- **Payments** — pagamentos, transações (ledger), repasses, comissões, cupões, reembolsos.
- **Communication** — conversas, mensagens, notificações multi-canal.
- **Trust & Safety** — avaliações, denúncias, antifraude, moderação, audit logs.

## 4. Fluxos críticos

### 4.1 Reserva + pagamento (caminho feliz)

1. `POST /reservations` — valida disponibilidade **com lock transacional**
   (`SELECT ... FOR UPDATE` no intervalo de datas) → cria reserva `PENDING` com TTL 30 min.
2. `POST /payments/checkout` — cria `Payment PENDING` e delega ao adaptador do método
   (ex.: Multicaixa Express push para o telemóvel).
3. Webhook do provedor → verificação de assinatura → idempotência por `providerRef` →
   `Payment PAID`, `Reservation CONFIRMED`, transações no ledger (valor, comissão, repasse).
4. Fila de notificações → email + SMS/WhatsApp com QR Code de check-in.
5. Repasse ao anfitrião libertado após check-in (escrow) via job agendado.

### 4.2 Prevenção de overbooking

- Constraint de exclusão no PostgreSQL sobre `daterange(checkIn, checkOut)` por imóvel
  (índice GiST) + verificação transacional na aplicação — dupla proteção.

### 4.3 Pesquisa

- Filtros SQL indexados (cidade, preço, tipo, capacidade, bounding box geográfico).
- Cache Redis por chave normalizada de pesquisa (TTL 60 s).
- Evolução: réplicas de leitura → OpenSearch/Meilisearch quando o catálogo crescer.

## 5. Escalabilidade e disponibilidade

- API stateless → réplicas horizontais atrás de load balancer; sessões apenas em JWT/Redis.
- PostgreSQL gerido (RDS/Railway) com réplica de leitura e PITR; Redis com AOF.
- Imagens servidas por CDN (Cloudinary/CloudFront); páginas públicas em edge (Vercel).
- Graceful shutdown, health checks (`/health`), circuit breakers nos provedores externos.
- Observabilidade: logs estruturados (pino), métricas Prometheus, tracing OpenTelemetry,
  alertas (p95 latência, erros 5xx, falhas de webhook).

## 6. Multi-país (roadmap)

- Tabelas `Country`/`City` desde o dia 1; preços com `currency`; conteúdo i18n por locale.
- Configuração por mercado: métodos de pagamento, impostos, comissão, idiomas.
