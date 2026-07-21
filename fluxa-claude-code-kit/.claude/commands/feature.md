---
description: Especificar e implementar uma nova funcionalidade da Fluxa seguindo o processo padrão
argument-hint: [descrição da funcionalidade]
---

Vamos criar a seguinte funcionalidade na Fluxa: $ARGUMENTS

Segue EXATAMENTE este processo, respeitando o CLAUDE.md e docs/PRODUCT.md:

**Parte A — Especificação (apresenta e ESPERA a minha confirmação antes de codificar):**
1. **Problema** — dor real, persona servida (PRODUCT.md), métrica de sucesso
2. **Lógica de negócio** — regras, casos-limite, estados, permissões RBAC necessárias
3. **UX** — fluxo passo a passo, ecrãs afetados, estados vazio/erro/carregamento
4. **Plano técnico** — ficheiros a criar/alterar, schema Prisma (com tenantId e índices), endpoints (método, rota, schema Zod, permissão), impacto no existente

**Parte B — Implementação (após confirmação):**
5. Migração Prisma + tipos partilhados em packages/shared
6. Backend: service com lógica, controller fino, DTOs Zod, auditoria via evento de domínio
7. Frontend: feature folder, componentes (packages/ui se reutilizáveis), TanStack Query, i18n
8. Testes essenciais (service + 1 teste de isolamento de tenant no mínimo)
9. Correr `pnpm typecheck && pnpm lint && pnpm test` e corrigir até verde

**Parte C — Fecho:**
10. Resumo do que ficou para v2, oportunidades premium (planos Business/Enterprise) e notas de desempenho (índices, cache, paginação)

Se a funcionalidade violar as Restrições Absolutas do CLAUDE.md (ex.: faturação fiscal) ou a filosofia do produto, diz não com fundamento e propõe a alternativa correta.
