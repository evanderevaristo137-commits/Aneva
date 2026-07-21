# FLUXA — Business Operating System

Plataforma SaaS de gestão empresarial com IA nativa, para PMEs em Angola/África lusófona, preparada para escala global.

**Especificação completa do produto:** @docs/PRODUCT.md
**Arquitetura e decisões técnicas:** @docs/ARCHITECTURE.md
**Modelo de dados de referência:** @docs/DATA-MODEL.md
**Roadmap por fases:** @docs/ROADMAP.md

---

## Restrições Absolutas (nunca violar)

1. A Fluxa **NÃO emite faturas fiscais nem documentos certificados**. É gestão operacional. Faturação certificada = integração externa (API/importação). Se um pedido se aproximar disto, alerta e propõe a alternativa correta.
2. **Todo o acesso a dados é filtrado por `tenantId`** — em queries Prisma, endpoints, jobs, e respostas da IA. Sem exceções. Código sem filtro de tenant é um bug de segurança, não um detalhe.
3. **RBAC em tudo**: cada endpoint declara permissões; a IA respeita as permissões do utilizador que pergunta.
4. **A IA nunca inventa números**: sem dados → diz que não há. Respostas numéricas indicam período e fonte.
5. Ações destrutivas ou financeiras exigem confirmação explícita.
6. **Multi-moeda sem suposições**: nenhum valor monetário existe sem `currency`; agregações convertem à moeda base do tenant e registam a taxa usada.
7. **Zero dados reais** em seeds, testes, fixtures ou prompts de exemplo — apenas dados fictícios.

## Hierarquia de Decisão (em conflito, por esta ordem)

1. Experiência do utilizador → 2. Simplicidade → 3. Velocidade → 4. Escalabilidade → 5. Custo de desenvolvimento

## Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Frontend** (`apps/web`): Next.js App Router, React, TypeScript estrito, TailwindCSS, shadcn/ui, Framer Motion, TanStack Query
- **Backend** (`apps/api`): NestJS, Prisma, PostgreSQL (+ pgvector), Redis + BullMQ
- **Partilhado** (`packages/shared`): tipos, schemas Zod, constantes; (`packages/ui`): design system
- **Mobile** (`apps/mobile`): React Native (Expo) — fase posterior
- **IA**: fornecedor LLM atrás de camada de abstração (`packages/ai`), RAG com pgvector, text-to-SQL read-only validado
- **Infra**: Docker, GitHub Actions, AWS, Cloudflare

Versões concretas vivem nos `package.json` — não as fixar em documentação.

## Comandos

```bash
pnpm dev            # arranca web + api em modo dev
pnpm build          # build de todos os workspaces
pnpm test           # testes (Vitest) de todos os workspaces
pnpm test:e2e       # testes end-to-end da API
pnpm lint           # ESLint + Prettier check
pnpm typecheck      # tsc --noEmit em todos os workspaces
pnpm db:migrate     # prisma migrate dev
pnpm db:studio      # prisma studio
pnpm db:seed        # dados de demonstração (2 tenants para testes de isolamento)
docker compose up -d # PostgreSQL + Redis locais
pnpm --filter api test   # testes de um workspace específico
```

Antes de dar uma tarefa por concluída: `pnpm typecheck && pnpm lint && pnpm test` têm de passar.

## Convenções de Código

- **TypeScript estrito**; `any` é proibido (usa `unknown` + narrowing)
- Nomes: `camelCase` (variáveis/funções), `PascalCase` (componentes/classes/tipos), `kebab-case` (ficheiros), tabelas em inglês no plural (`customers`, `stock_movements`)
- **Código e comentários em inglês**; textos visíveis ao utilizador via i18n (pt-PT como locale base, chaves em `packages/shared/i18n`)
- Validação com **Zod** partilhada entre frontend e backend — nunca validar só num lado
- Datas em UTC na base de dados; formatação no cliente. Dinheiro como inteiros em centavos + campo `currency` (ISO 4217); nunca floats
- Erros da API: formato consistente `{ code, message, details? }` com códigos HTTP corretos; códigos do catálogo em `packages/shared` (`VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `INTERNAL`)
- Todo o modelo Prisma de dados de negócio tem: `id` (cuid), `tenantId` + índice composto, `createdAt`, `updatedAt`, soft delete (`deletedAt`) quando aplicável
- Escritas relevantes geram registo de auditoria (`audit_logs`: quem, o quê, quando, antes/depois) via evento de domínio
- Paginação por cursor em todas as listas; nunca devolver coleções ilimitadas
- Estrutura: backend em módulos NestJS por domínio; frontend em feature folders. Uma feature nunca importa de outra diretamente — o que é comum sobe para `packages/shared` ou `packages/ui`
- Testes Vitest em `*.spec.ts` junto ao código. Mínimo por módulo: teste do service, teste de isolamento de tenant, teste de RBAC
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`...) em inglês

## Convenções de API

- REST versionada: `/v1/<recurso>` (plural, kebab-case); verbos HTTP semânticos
- Listas: `?cursor=&limit=` → `{ items, nextCursor }`; filtros por query params validados com Zod
- Datas ISO 8601 em UTC; mutações devolvem o recurso completo atualizado
- POSTs críticos (financeiro, stock) aceitam `Idempotency-Key`
- Webhooks de saída assinados com HMAC; retries com backoff exponencial

## Convenções de UI

- Mobile-first real; testa mentalmente cada ecrã a 375px
- Dark mode é cidadão de primeira classe (tokens, nunca cores hardcoded)
- Todo o ecrã tem estados: loading (skeletons, não spinners), vazio (que ensina), erro (com ação de recuperação)
- Optimistic updates onde seguro; `Cmd/Ctrl+K` como paleta de comandos universal
- Pouco texto; hierarquia tipográfica clara; animações discretas com propósito; ícones Lucide
- Acessibilidade AA: contraste, foco visível, navegação por teclado, `prefers-reduced-motion`
- Componentes novos entram em `packages/ui` se reutilizáveis; nunca duplicar componentes

## Segurança

- Auth: JWT curto + refresh token rotativo; ordem dos guards: auth → tenant → rbac
- Nunca registar em logs dados pessoais, tokens ou segredos; logs estruturados com `tenantId` + `requestId`
- Uploads: validar tipo e tamanho, armazenar em S3 (nunca no filesystem da app), servir com URLs assinadas
- Segredos só em variáveis de ambiente; `.env*` nunca é lido, commitado ou impresso

## Fluxo de Trabalho

- **Planear antes de codificar**: para funcionalidades não triviais, apresenta plano curto (ficheiros a tocar, schema, endpoints) e espera confirmação antes de implementar em massa
- PRs pequenos e focados: um assunto por PR; se o plano não cabe num PR revisável, divide em blocos
- `/fluxa-review` antes de cada merge; subagente `security-reviewer` para código que toca em auth, tenant ou dinheiro
- Migrações Prisma: nunca editar migrações já aplicadas; criar nova
- Funcionalidade nova = código + testes essenciais + estados de UI + i18n + auditoria. Ver checklist em @docs/PRODUCT.md (Definição de Pronto)
- Usa os comandos personalizados: `/feature`, `/module`, `/fluxa-review`, `/db-change`, `/ai-feature`, `/ui-screen` (em `.claude/commands/`)

## Anti-padrões (rejeitar mesmo que pedido casualmente)

- Query sem `tenantId` · `any` · floats para dinheiro · strings hardcoded na UI · endpoint sem validação Zod · lista sem paginação · lógica de negócio no controller (vive em services) · `console.log` em produção (usa o logger estruturado) · fetch manual no cliente fora do TanStack Query · `useEffect` para carregar dados · componente com mais de ~300 linhas (dividir) · lançar strings em vez de exceções tipadas · segredo hardcoded "só para testar"
