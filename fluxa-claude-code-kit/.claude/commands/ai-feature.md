---
description: Criar ou alterar uma capacidade de IA da Fluxa com guardrails verificados
argument-hint: [descrição da capacidade de IA]
---

Capacidade de IA pedida: $ARGUMENTS

Segue este processo, respeitando o CLAUDE.md (Restrições Absolutas 2–5) e docs/ARCHITECTURE.md (Camada de IA):

**Parte A — Especificação (apresenta e ESPERA confirmação):**
1. **Problema e persona** — que trabalho elimina, para quem, como se mede
2. **Superfície** — onde aparece (Cmd+K, resumo diário, insight contextual, ação com confirmação)
3. **Dados necessários** — tabelas/colunas para a allowlist do text-to-SQL, fontes RAG, permissões RBAC que o utilizador precisa de ter
4. **Plano técnico** — router/intenção, prompt (novo ou alterado em `packages/ai/prompts/`), tools, formato da resposta (texto + spec de gráfico?)

**Parte B — Implementação (após confirmação):**
5. Prompt versionado no repositório; nunca inline no código do módulo
6. Text-to-SQL: allowlist mínima necessária (não alargar "por conveniência"), `tenantId` injetado, LIMIT, timeout, validação AST
7. Contexto filtrado pelo RBAC do utilizador que pergunta — a IA não vê o que a UI não mostraria
8. Medição: tokens e custo registados por tenant; respeitar limites do plano
9. Cache Redis quando a pergunta é normalizável

**Parte C — Verificação obrigatória (testes de regressão):**
10. Teste com 2 tenants: a resposta nunca contém dados do outro tenant
11. Teste sem permissão: utilizador sem `module:read` não obtém esses dados via IA
12. Teste sem dados: a resposta diz que não há dados — nunca inventa números
13. Resposta numérica indica período e fonte
14. Se a capacidade executa ações: exigem confirmação explícita; nunca destrutivas/financeiras automáticas
15. Correr `pnpm typecheck && pnpm lint && pnpm test` até verde

Se a capacidade pedida violar um guardrail (ex.: "deixa a IA apagar registos sozinha"), recusa com fundamento e propõe a alternativa (ação com confirmação).
