---
description: Criar um ecrã da Fluxa com todos os estados, i18n e padrões de UI
argument-hint: [descrição do ecrã, ex: listagem de fornecedores]
---

Ecrã pedido: $ARGUMENTS

Cria o ecrã seguindo o CLAUDE.md (Convenções de UI) e o design de referência do PRODUCT.md (secção Design). Antes de codificar, apresenta em 5 linhas: rota, componentes, dados (queries/mutações), permissões — e espera confirmação se houver decisões de UX em aberto.

**Checklist de implementação:**

1. **Estrutura** — feature folder correta (`apps/web/src/features/<módulo>/`); componentes reutilizáveis sobem para `packages/ui`
2. **Dados** — TanStack Query com hooks nomeados (`use-<recurso>-list`, mutações com optimistic update onde seguro); nunca fetch manual nem `useEffect` para dados
3. **Estados obrigatórios**:
   - Loading: skeletons com a forma real do conteúdo (nunca spinner)
   - Vazio: ensina o que fazer (1 frase + ação primária)
   - Erro: mensagem clara + ação de recuperação (retry)
4. **Mobile-first** — desenha a 375px primeiro; tabela vira cards/lista em mobile
5. **Dark mode** — só tokens do design system; zero cores hardcoded
6. **i18n** — todas as strings via chaves em `packages/shared/i18n` (pt-PT base); zero texto hardcoded
7. **RBAC na UI** — ações escondidas sem permissão (o backend continua a ser a autoridade)
8. **Acessibilidade** — foco visível, navegação por teclado, labels nos inputs, contraste AA
9. **Cmd/Ctrl+K** — regista as ações principais do ecrã na paleta de comandos
10. **Performance** — lista paginada por cursor com infinite scroll ou "carregar mais"; sem waterfalls de queries

**Fecho:** `pnpm typecheck && pnpm lint && pnpm test` verdes; descreve como testar manualmente o ecrã em 3 passos.
