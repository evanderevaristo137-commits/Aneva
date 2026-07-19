# FLUXA — Arquitetura

## Estrutura do Monorepo

```
fluxa/
├── apps/
│   ├── web/                  # Next.js (App Router)
│   │   └── src/
│   │       ├── app/          # rotas (route groups: (auth), (app))
│   │       ├── features/     # 1 pasta por módulo: components, hooks, api
│   │       └── lib/
│   ├── api/                  # NestJS
│   │   └── src/
│   │       ├── modules/      # 1 módulo Nest por domínio (crm, inventory, ...)
│   │       │   └── <domínio>/
│   │       │       ├── <domínio>.controller.ts
│   │       │       ├── <domínio>.service.ts
│   │       │       ├── dto/            # schemas Zod → DTOs
│   │       │       └── <domínio>.spec.ts
│   │       ├── common/       # guards (auth, tenant, rbac), interceptors, filters
│   │       └── infra/        # prisma, redis, queues, storage, mail
│   └── mobile/               # Expo (fase 6+)
├── packages/
│   ├── shared/               # tipos, schemas Zod, constantes, i18n keys
│   ├── ui/                   # design system (sobre shadcn/ui)
│   ├── ai/                   # abstração LLM, RAG, prompts, tools
│   └── config/               # eslint, tsconfig, tailwind preset partilhados
├── prisma/                   # schema.prisma, migrações, seed
├── docker-compose.yml        # postgres + redis locais
├── turbo.json
└── .claude/                  # comandos e agentes do Claude Code
```

## Decisões Estruturais

- **Monólito modular primeiro.** Um deploy da API, módulos NestJS bem isolados que comunicam por interfaces internas. Microsserviços só quando a escala o exigir — a estrutura modular torna a extração barata.
- **Multi-tenant por linha** (`tenantId` em todas as tabelas de negócio) com Postgres Row-Level Security como segunda camada de defesa. Prisma Client Extension injeta `tenantId` automaticamente a partir do contexto do pedido — nunca confiar apenas na disciplina do programador.
- **Contexto de pedido**: middleware extrai `tenantId` + `userId` + permissões do JWT e coloca-os em AsyncLocalStorage; services leem daí, não de parâmetros soltos.
- **RBAC**: papéis (`OWNER`, `ADMIN`, `MANAGER`, `STAFF`, custom) → permissões granulares `module:action` (ex.: `inventory:write`). Guard `@RequirePermission()` em cada endpoint.
- **API REST** versionada (`/v1`), documentada com OpenAPI (gerada dos schemas Zod). Webhooks assinados (HMAC) para eventos de domínio.
- **Eventos de domínio internos** (event emitter → BullMQ): auditoria, notificações, atualização de embeddings e webhooks são side-effects assíncronos, nunca inline no request.

## Ciclo de Vida de um Pedido

```
HTTP request
 1. Rate limiter (por IP e por utilizador)
 2. AuthGuard        → valida JWT, carrega userId
 3. TenantMiddleware → resolve tenantId + permissões → AsyncLocalStorage
 4. RbacGuard        → @RequirePermission("module:action")
 5. ZodValidationPipe→ valida body/query com schema partilhado
 6. Controller (fino)→ chama o service; zero lógica de negócio
 7. Service          → lógica; Prisma já filtrado por tenant (extension)
 8. DomainEvents     → emite eventos (auditoria, notificações, embeddings)
 9. Interceptor      → serializa resposta { data } | erro { code, message, details? }
```

Jobs de fila reconstroem o mesmo contexto (tenantId no payload do job) antes de tocar na base de dados — um job sem tenant no payload é um bug.

## Isolamento de Tenant — implementação de referência

**Camada 1 — Prisma Client Extension** (automática, em `apps/api/src/infra/prisma/`):

```ts
// Every business-model query gets tenantId injected from request context.
const tenantPrisma = prisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const ctx = requestContext.get(); // AsyncLocalStorage
        if (TENANT_MODELS.has(model)) {
          args = injectTenantId(args, operation, ctx.tenantId);
        }
        return query(args);
      },
    },
  },
});
```

**Camada 2 — Row-Level Security no Postgres** (defesa em profundidade):

```sql
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON customers
  USING (tenant_id = current_setting('app.tenant_id')::text);
-- A app define app.tenant_id no início de cada transação.
```

**Camada 3 — Testes obrigatórios**: o seed cria sempre 2 tenants; cada módulo tem um teste que prova que o tenant A não lê nem escreve dados do tenant B (direto, via relações/includes, e via jobs).

## RBAC — uso de referência

```ts
@Post("/v1/stock-movements")
@RequirePermission("inventory:write")
async create(@Body(zodPipe(createStockMovementSchema)) dto: CreateStockMovementDto) {
  return this.inventoryService.createMovement(dto);
}
```

- Papéis base: `OWNER` (tudo), `ADMIN` (tudo menos billing/apagar tenant), `MANAGER` (módulos atribuídos, read+write), `STAFF` (módulos atribuídos, conforme permissões)
- Papéis custom = conjunto de permissões `module:action`; geridos no plano Business+
- O frontend esconde o que o utilizador não pode fazer; o backend é a autoridade — nunca confiar no frontend

## Modelo de Dados — Regras

Detalhe completo em `docs/DATA-MODEL.md`. Regras invariantes:

- Todo o modelo de negócio: `id String @id @default(cuid())`, `tenantId String` + `@@index([tenantId, ...])`, `createdAt`, `updatedAt`, `deletedAt DateTime?` quando fizer sentido
- Dinheiro: `amountCents Int` (ou `BigInt` onde necessário) + `currency Char(3)`; conversões guardam a taxa usada
- Auditoria: tabela `audit_logs` (tenantId, userId, action, entity, entityId, before Json?, after Json?, ip, createdAt)
- Enums para estados; máquinas de estado explícitas para fluxos (ex.: ordem de compra: DRAFT → SENT → PARTIALLY_RECEIVED → RECEIVED → CLOSED / CANCELLED); transições validadas no service, nunca no cliente

## API — contratos

**Formato de sucesso:** `{ "data": ... }` · **listas:** `{ "data": { "items": [...], "nextCursor": "..." } }`

**Formato de erro:** `{ "code": "FORBIDDEN", "message": "...", "details": { ... } }`

| Código | HTTP | Quando |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Zod falhou; `details.issues` com os campos |
| `UNAUTHORIZED` | 401 | Sem sessão válida |
| `FORBIDDEN` | 403 | Sem permissão RBAC ou tenant errado |
| `NOT_FOUND` | 404 | Recurso inexistente **no tenant do utilizador** |
| `CONFLICT` | 409 | Estado inválido (ex.: receção de ordem cancelada), duplicado |
| `RATE_LIMITED` | 429 | Limite excedido; header `Retry-After` |
| `INTERNAL` | 500 | Erro não previsto; nunca expõe stack/SQL |

**Paginação por cursor:** cursor = base64 de `[valorDeOrdenação, id]`; `limit` máx. 100, default 25. Ordenação estável (sempre com `id` como desempate).

## Eventos de Domínio — catálogo base

| Evento | Payload (mínimo) | Consumidores |
|---|---|---|
| `entity.created/updated/deleted` | tenantId, userId, entity, entityId, before?, after | Auditoria, embeddings (RAG), webhooks |
| `stock.below_minimum` | tenantId, productId, warehouseId, qty, min | Notificações, sugestão de reposição (IA) |
| `purchase_order.state_changed` | tenantId, orderId, from, to | Notificações, financeiro (conta a pagar) |
| `payable.due_soon` / `receivable.overdue` | tenantId, entryId, dueDate | Notificações, resumo diário |
| `document.expiring` | tenantId, documentId, expiresAt | Notificações, agenda |
| `user.invited/joined` | tenantId, email, role | Email, auditoria |

Regras: eventos são factos no passado (nome no pretérito ou estado), payload autossuficiente (o consumidor não volta a ler o request), sempre com `tenantId`.

## Filas (BullMQ)

| Fila | Uso | Retry |
|---|---|---|
| `events` | fan-out de eventos de domínio | 3× backoff exponencial |
| `notifications` | in-app, email, push | 5× backoff; DLQ |
| `ai` | embeddings, resumos, análises | 3×; timeout generoso; custo medido |
| `exports` | PDF/Excel/CSV, relatórios agendados | 2×; resultado em S3 com URL assinada |
| `sync` | reconciliação offline (mobile) | idempotente por operationId |

Todas as filas: jobs idempotentes (chave natural no payload), DLQ monitorizada com alerta, `tenantId` obrigatório no payload.

## Camada de IA (`packages/ai`)

```
Pergunta do utilizador
   → Router (classifica intenção)
   → RAG (pgvector: documentos, notas, descrições)
   → Text-to-SQL seguro: SELECT-only, allowlist de tabelas/colunas,
     tenantId injetado, LIMIT obrigatório, timeout, validação AST antes de executar
   → LangGraph para fluxos multi-passo (relatórios, análises, ações com confirmação)
   → Resposta: texto + spec de gráfico (JSON) que o frontend renderiza
```

- Abstração de fornecedor LLM (`packages/ai/providers/`): trocar de fornecedor (OpenAI, Anthropic, …) sem tocar nos módulos
- Cache de respostas frequentes (Redis, chave por tenant+pergunta normalizada)
- Custos de tokens medidos e limitados por plano/tenant
- Prompts versionados no repositório (`packages/ai/prompts/`), com testes de regressão sobre o seed (as 9 perguntas de referência do PRODUCT.md são o smoke test)
- O contexto enviado ao LLM passa pelo mesmo filtro RBAC do utilizador — a IA nunca vê mais do que o utilizador veria

## Offline e Sincronização (apps móveis / PWA)

- Fila local de operações (outbox) persistida no dispositivo; cada operação tem `operationId` (uuid) para idempotência no servidor
- Sincronização por entidade com `updatedAt` + versão; conflitos: last-write-wins com registo de auditoria do valor sobreposto
- Leituras servidas de cache local; indicador de estado de sincronização sempre visível

## Estratégia de Testes

| Nível | Ferramenta | O que cobre | Quando corre |
|---|---|---|---|
| Unit | Vitest | services (lógica, máquinas de estado), utils, schemas Zod | cada PR |
| Integração | Vitest + Postgres de teste | módulo completo com Prisma real; **isolamento de tenant**; RBAC | cada PR |
| E2E API | Vitest + supertest | fluxos críticos (auth, compra→stock, lançamento financeiro) | cada PR |
| E2E UI | Playwright | smoke dos fluxos de onboarding e núcleo | main + nightly |
| IA (regressão) | Vitest sobre seed | as 9 perguntas de referência com respostas esperadas | main + nightly |

Convenções: factories partilhadas para dados de teste (sempre 2 tenants), zero dados reais, testes determinísticos (relógio e uuid mockáveis).

## CI/CD e Ambientes

**Pipeline (GitHub Actions — template em `templates/ci.yml`):**
`install → typecheck → lint → test (com Postgres+Redis service containers) → build → deploy`

- PR: tudo até `build`; deploy de preview do frontend
- `main`: deploy automático para **staging**; migrações correm antes do deploy da API (estratégia expand/contract para zero-downtime)
- **produção**: promoção manual a partir de staging (tag), com plano de rollback

| Ambiente | Infra | Dados |
|---|---|---|
| local | docker compose (Postgres+Redis) | seed de demonstração |
| staging | AWS (espelho de prod, menor) | dados sintéticos; nunca cópias de produção |
| produção | AWS: ECS/Fargate (api), RDS Postgres, ElastiCache Redis, S3 (+CloudFront), Vercel ou CloudFront para o web | backups automáticos + restore drills |

Infra como código (Terraform) desde staging; segredos no AWS Secrets Manager.

## Segurança e Conformidade

- Auth: JWT curto + refresh token rotativo; 2FA opcional (TOTP); sessões geríveis; rate limiting por IP e por utilizador
- Segredos fora do código (env + secrets manager); princípio do menor privilégio
- TLS em trânsito, encriptação em repouso; backups automáticos testados (restore drills)
- Proteção de dados: Lei n.º 22/11 (Angola) e RGPD (expansão); exportação total dos dados do tenant; direito ao apagamento (soft delete → purga agendada)
- Logs estruturados (pino) com `tenantId`/`requestId`; Sentry para erros; métricas de latência com alertas

## Observabilidade

- **Logs**: pino JSON → agregador; sempre `tenantId`, `requestId`, `userId`; nunca dados pessoais/segredos
- **Erros**: Sentry (api + web) com release tracking
- **Métricas**: p50/p95/p99 por endpoint, profundidade das filas, custo de IA por tenant, erros 5xx
- **Alertas mínimos**: p95 > 300 ms sustentado, fila com atraso > 5 min, DLQ não vazia, erro 5xx acima de baseline, custo IA anómalo

## Metas de Desempenho

- p95 API < 300 ms; carregamento inicial < 2 s em 3G
- Paginação por cursor; índices revistos em cada migração; N+1 proibido (usar `include`/dataloaders conscientemente)
- Optimistic UI onde seguro; ISR/SSR no Next.js onde beneficia

## Decisões Registadas (mini-ADRs)

| Decisão | Porquê | Revisitar quando |
|---|---|---|
| Monólito modular (não microsserviços) | Velocidade de desenvolvimento; equipa pequena | > ~10 devs ou módulo com escala muito díspar |
| Multi-tenant por linha + RLS (não schema/DB por tenant) | Custo e simplicidade operacional | Cliente Enterprise exigir isolamento físico |
| REST (não GraphQL) | Simplicidade, cache, tooling; OpenAPI dos schemas Zod | Frontend precisar de composição de dados muito dinâmica |
| Cursor pagination em tudo | Estável sob escrita concorrente; performance | — |
| LLM atrás de abstração própria | Trocar fornecedor sem reescrever módulos; custos controlados | — |
| Last-write-wins na sincronização offline | Simplicidade; auditoria guarda o valor sobreposto | Conflitos reais frequentes em campo |
