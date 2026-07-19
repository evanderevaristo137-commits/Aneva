<!-- FLUXA — copiar para .github/pull_request_template.md na Fase 0 -->

## O que muda

<!-- 2–4 frases: problema, solução, persona servida -->

## Tipo

- [ ] feat · [ ] fix · [ ] chore/refactor · [ ] docs · [ ] migração de dados

## Checklist Fluxa (Definição de Pronto)

- [ ] Queries filtradas por `tenantId` (ou cobertas pela Prisma extension)
- [ ] Endpoints com `@RequirePermission()` + validação Zod partilhada
- [ ] Estados de UI: loading (skeleton) / vazio / erro
- [ ] i18n: zero strings hardcoded (chaves em `packages/shared/i18n`)
- [ ] Auditoria nas escritas relevantes (evento de domínio)
- [ ] Listas paginadas por cursor
- [ ] Testes: service + isolamento de tenant + RBAC
- [ ] Migrações novas (nenhuma migração aplicada foi editada)
- [ ] `pnpm typecheck && pnpm lint && pnpm test` verdes
- [ ] `/fluxa-review` corrido; `security-reviewer` se toca auth/tenant/dinheiro/IA

## Como testar

<!-- 3 passos concretos sobre o seed -->

## Fora de âmbito / v2

<!-- o que ficou conscientemente de fora -->
