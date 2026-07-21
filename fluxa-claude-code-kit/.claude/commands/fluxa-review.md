---
description: Rever alterações atuais contra os padrões da Fluxa (segurança multi-tenant, RBAC, qualidade)
allowed-tools: Read, Grep, Glob, Bash(git diff:*), Bash(git status:*)
---

## Alterações
!`git status --short`
!`git diff HEAD`

Revê estas alterações como revisor sénior da Fluxa. Verifica por ordem de gravidade:

**Bloqueadores (segurança):**
1. Alguma query Prisma sem filtro/injeção de `tenantId`?
2. Algum endpoint sem `@RequirePermission()` ou sem validação Zod do input?
3. Dados de um tenant podem vazar para outro (joins, includes, jobs, respostas da IA)?
4. Segredos, tokens ou credenciais no código?

**Graves (padrões do CLAUDE.md):**
5. `any`, floats para dinheiro, datas sem UTC, strings hardcoded na UI (i18n)?
6. Listas sem paginação por cursor? N+1 queries?
7. Lógica de negócio em controllers em vez de services?
8. Escritas relevantes sem evento de auditoria?

**Qualidade:**
9. Estados vazio/erro/carregamento nos ecrãs tocados?
10. Testes essenciais presentes? Migrações Prisma novas (não editadas)?
11. Nomes e estrutura consistentes com módulos existentes?

Reporta por gravidade com ficheiro:linha e correção concreta. Se estiver tudo bem, di-lo sem inventar problemas.
