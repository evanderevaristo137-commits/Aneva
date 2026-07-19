---
description: Alterar o schema da base de dados de forma segura (Prisma + migração + tipos)
argument-hint: [descrição da alteração]
---

Alteração de base de dados pedida: $ARGUMENTS

Segue este processo:

1. **Analisa o impacto**: lê `prisma/schema.prisma` e identifica modelos, relações, índices e código afetados (services, DTOs, frontend)
2. **Propõe o diff do schema** antes de aplicar, verificando:
   - `tenantId` + índice composto em modelos de negócio novos
   - `createdAt/updatedAt` (+ `deletedAt` se aplicável)
   - Dinheiro em cents + `currency`; datas em UTC; enums para estados
   - Compatibilidade com dados existentes (a migração é destrutiva? precisa de backfill?)
3. Após confirmação: cria a migração (`pnpm db:migrate`) com nome descritivo — **nunca** editar migrações já aplicadas
4. Atualiza tipos/schemas Zod em packages/shared e todo o código afetado
5. Atualiza o seed se necessário
6. Corre `pnpm typecheck && pnpm test` até verde e resume o que mudou
