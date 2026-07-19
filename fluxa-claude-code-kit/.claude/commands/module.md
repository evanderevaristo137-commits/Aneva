---
description: Criar o esqueleto completo de um novo módulo da Fluxa (backend + frontend)
argument-hint: [nome do módulo, ex: inventory]
---

Cria o esqueleto completo do módulo "$ARGUMENTS" da Fluxa, consistente com os módulos existentes e com docs/ARCHITECTURE.md.

Antes de criar ficheiros, apresenta o plano (entidades, endpoints, ecrãs) e espera confirmação.

**Backend (`apps/api/src/modules/$ARGUMENTS/`):**
- Modelos Prisma com `tenantId` + índices compostos, `createdAt/updatedAt/deletedAt`, enums de estado
- Service com lógica de negócio; controller fino com `@RequirePermission("$ARGUMENTS:read|write")`
- DTOs Zod em `dto/`, partilhados via packages/shared
- Eventos de domínio para auditoria e notificações
- Testes: service + isolamento de tenant

**Frontend (`apps/web/src/features/$ARGUMENTS/`):**
- Página de listagem: tabela paginada por cursor, pesquisa, filtros, estado vazio que ensina, skeletons
- Detalhe/edição com validação Zod partilhada e optimistic updates
- Hooks TanStack Query (`use-$ARGUMENTS-list`, `use-$ARGUMENTS-detail`, mutações)
- Entrada na navegação lateral (visível conforme permissões) e ações no Cmd+K
- Chaves i18n em packages/shared/i18n (pt-PT base)

**Fecho:** correr `pnpm typecheck && pnpm lint && pnpm test` até verde e resumir próximos passos do módulo.
