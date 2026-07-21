# Kit Fluxa para Claude Code

Este kit configura o Claude Code para construir a **Fluxa** (Business Operating System para PMEs) com contexto completo e padrões consistentes desde o primeiro prompt.

## Conteúdo

```
CLAUDE.md                      # Memória do projeto (carregada automaticamente)
docs/
  PRODUCT.md                   # Especificação de produto: personas, jornadas, módulos v1/v2, IA, planos, métricas
  ARCHITECTURE.md              # Arquitetura: monorepo, isolamento de tenant, RBAC, API, eventos, filas, testes, CI/CD
  DATA-MODEL.md                # Modelo de dados de referência (Prisma) — núcleo + módulos
  ROADMAP.md                   # Fases com entregas, critérios de saída testáveis e prompts prontos
.claude/
  settings.json                # Permissões seguras (testes/lint permitidos; .env e segredos bloqueados)
  commands/
    feature.md                 # /feature      — especificar e implementar funcionalidades
    module.md                  # /module       — esqueleto completo de um módulo
    ui-screen.md               # /ui-screen    — ecrã com todos os estados, i18n e RBAC
    ai-feature.md              # /ai-feature   — capacidades de IA com guardrails verificados
    db-change.md               # /db-change    — alterações de schema seguras
    fluxa-review.md            # /fluxa-review — revisão contra os padrões da Fluxa
  agents/
    security-reviewer.md       # Subagente auditor (tenant, RBAC, segredos, IA) — read-only
templates/
  ci.yml                       # GitHub Actions base (copiar para .github/workflows/ na Fase 0)
  pull_request_template.md     # Template de PR com a checklist da Definição de Pronto
```

## Como usar

1. Cria a pasta do projeto e copia este kit para a raiz:
   ```bash
   mkdir fluxa && cd fluxa
   # copiar CLAUDE.md, docs/, .claude/ e templates/ para aqui
   git init && git add -A && git commit -m "chore: add Claude Code project kit"
   ```
2. Abre o Claude Code na pasta:
   ```bash
   claude
   ```
   O `CLAUDE.md` é carregado automaticamente em cada sessão (e importa os docs via `@docs/...`).
3. Arranca com o primeiro prompt do `docs/ROADMAP.md` (Fase 0). Na Fase 0, move `templates/ci.yml` para `.github/workflows/ci.yml` e `templates/pull_request_template.md` para `.github/pull_request_template.md`.
4. No dia-a-dia:
   - `/feature adicionar alertas de validade de lotes no inventário`
   - `/module projects`
   - `/ui-screen listagem de fornecedores com filtros`
   - `/ai-feature deteção de despesas anómalas no resumo diário`
   - `/db-change adicionar centros de custo às despesas`
   - `/fluxa-review` antes de cada commit importante
   - Pede o subagente `security-reviewer` em PRs que tocem auth, tenant, dinheiro ou IA
   - `#` no chat para adicionar novas convenções à memória; `/memory` para editar

## Fluxo recomendado por fase

1. **Planear**: prompt de fase do ROADMAP.md → Claude propõe o plano em blocos de PR → confirmas
2. **Implementar**: bloco a bloco; commits pequenos com Conventional Commits
3. **Rever**: `/fluxa-review` (+ `security-reviewer` quando aplicável) antes de cada merge
4. **Fechar a fase**: prompt "Fechar uma fase" do ROADMAP.md — os critérios de saída são verificados um a um com testes

## Dicas

- **Confirma planos antes de implementação em massa** — os comandos já pedem isso, mantém o hábito.
- Trabalha em fases pequenas com commits frequentes; usa `/fluxa-review` antes de fazer merge.
- Quando uma convenção nova surgir ("passámos a usar X"), acrescenta uma linha ao CLAUDE.md — memória curta e sempre verdadeira vale mais do que documentos longos.
- Os documentos em `docs/` são a fonte de verdade do produto; quando a realidade divergir, atualiza-os no mesmo PR que muda o código.
- Documentação oficial do Claude Code: https://docs.claude.com/en/docs/claude-code/overview
