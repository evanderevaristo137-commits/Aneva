# FLUXA — Roadmap por Fases

Construir por fases, cada uma terminando num estado utilizável e testado. Não avançar de fase com a anterior a falhar `typecheck/lint/test`. Cada fase fecha com uma demo real sobre dados seed.

## Fase 0 — Fundações (semana 1–2)

**Objetivo:** um esqueleto onde tudo o resto encaixa sem retrabalho.

**Entregas:**
- Monorepo pnpm + Turborepo; `packages/config` (eslint, tsconfig, tailwind preset partilhados)
- `docker-compose.yml`: Postgres (com pgvector) + Redis
- CI GitHub Actions (base em `templates/ci.yml`): install → typecheck → lint → test → build
- NestJS base: Prisma ligado, contexto de pedido (AsyncLocalStorage), logger pino, filtro global de erros com o formato `{ code, message, details? }`, health check `/v1/health`
- Next.js base: layout, tema dark/light com tokens, shell da app (sidebar + topbar + `Cmd/Ctrl+K` placeholder), página de login estática
- `packages/shared` com os primeiros schemas Zod (auth) e catálogo de códigos de erro

**Critérios de saída (testáveis):**
- [ ] `pnpm dev` levanta web + api; `/v1/health` responde
- [ ] CI verde num PR de teste
- [ ] Erro lançado num controller sai no formato padrão com `requestId`

**Riscos/atenção:** não gastar mais de 2 semanas aqui — perfeição de tooling é procrastinação.

## Fase 1 — Plataforma multi-tenant (semana 3–4)

**Objetivo:** a fundação de segurança sobre a qual nenhum compromisso é aceitável.

**Entregas:**
- Auth completa: registo de empresa (tenant + owner), login, JWT + refresh rotativo, convites por email com papel
- RBAC: papéis base, permissões `module:action`, guard `@RequirePermission()`
- Isolamento: Prisma Client Extension (injeção de `tenantId`) + políticas RLS; seed com 2 tenants
- Auditoria (`audit_logs`) via eventos de domínio + fila `events`
- Gestão de conta: perfil, utilizadores e papéis, definições da empresa (moeda base, fuso, idioma)
- Notificações in-app (modelo + sino no shell)

**Critérios de saída:**
- [ ] Teste automatizado: tenant A não lê/escreve dados do tenant B (direto, via include, via job)
- [ ] Teste automatizado: STAFF sem `module:write` recebe 403 e a UI esconde a ação
- [ ] Escritas relevantes aparecem em `audit_logs` com before/after
- [ ] Convite → registo → acesso com papel certo, ponta a ponta

**Riscos/atenção:** é a fase mais crítica do projeto; `/fluxa-review` + subagente `security-reviewer` em todos os PRs.

## Fase 2 — Núcleo operacional (semana 5–8)

**Objetivo:** um dono de PME regista o dia-a-dia e o dashboard responde.
Ordem: **Financeiro (registos) → CRM → Tarefas → Dashboard** (o dashboard precisa dos dados dos outros três).

**Entregas:**
- Financeiro v1: receitas/despesas, categorias, contas a pagar/receber (PENDING + dueAt), multi-moeda com taxa registada
- CRM v1: clientes, leads, pipeline Kanban, notas e follow-ups
- Tarefas v1: CRUD, responsáveis, prioridades, notificações
- Dashboard v1: KPIs do período (receitas, despesas, resultado), comparação com período anterior, lista de alertas (vencidos, follow-ups de hoje, tarefas atrasadas)
- Exportação CSV nas listas do Financeiro (o Financeiro precisa dela desde o dia 1)

**Critérios de saída:**
- [ ] Jornada completa sobre seed: criar cliente → lead → ganhar → registar receita → ver no dashboard
- [ ] Conta a pagar vencida gera alerta no dashboard e notificação
- [ ] Lançamento em USD num tenant AOA converte e regista a taxa
- [ ] Todas as listas paginadas por cursor; estados vazio/erro/carregamento presentes

**Riscos/atenção:** resistir a fazer "faturação disfarçada" no Financeiro — lançamentos, não documentos.

## Fase 3 — Inventário e Compras (semana 9–12)

**Objetivo:** ciclo completo compra → receção → stock → alerta.

**Entregas:**
- Inventário: produtos, categorias, multi-armazém, movimentos imutáveis (IN/OUT/TRANSFER/ADJUSTMENT com motivo), stock mínimo + alertas, projeção `StockItem` + job de reconciliação noturno
- Compras: fornecedores, ordens com máquina de estados, receção parcial que movimenta stock, conta a pagar gerada por evento
- Sequências por tenant (`PO-2026-0001`) via tabela `counters`

**Critérios de saída:**
- [ ] Ordem criada → enviada → receção parcial → stock atualizado → segunda receção → RECEIVED → conta a pagar no Financeiro
- [ ] Stock abaixo do mínimo dispara evento, notificação e alerta no dashboard
- [ ] Ajuste sem motivo é rejeitado; movimentos não são editáveis (só contra-movimento)
- [ ] Reconciliação noturna não encontra desvios sobre o seed de testes de carga

**Riscos/atenção:** consistência da projeção de stock sob concorrência — transações e testes de corrida.

## Fase 4 — IA nativa (semana 13–16)

**Objetivo:** o diferencial a funcionar com guardrails à prova de auditoria.

**Entregas:**
- `packages/ai`: abstração de fornecedor, RAG (pgvector sobre notas/descrições/documentos), text-to-SQL seguro (SELECT-only, allowlist, AST validado, `tenantId` injetado, LIMIT, timeout)
- Assistente no shell: `Cmd/Ctrl+K` → perguntar; resposta com texto + gráfico (spec JSON)
- Resumo diário do dashboard; deteção de clientes inativos; previsão de rutura de stock
- Medição de custo por tenant; limites por plano; cache Redis de perguntas frequentes
- Testes de regressão: as 9 perguntas de referência do PRODUCT.md sobre o seed

**Critérios de saída:**
- [ ] As 9 perguntas respondem corretamente (asserções sobre números do seed) com período e fonte
- [ ] Pergunta sobre dados de outro tenant devolve "não tenho esses dados" (teste com 2 tenants)
- [ ] Utilizador sem `finance:read` não obtém números financeiros via IA
- [ ] Pergunta sem dados responde "não há dados" — nunca inventa
- [ ] Custo de tokens visível por tenant no admin interno

**Riscos/atenção:** o text-to-SQL é superfície de ataque — revisão de segurança dedicada; nunca relaxar a allowlist para "resolver" uma pergunta.

## Fase 5 — Restantes módulos (semana 17–22)

Ordem sugerida: **Projetos → Agenda → Documentos → RH → Relatórios** (Relatórios por último — beneficia de todos os dados).

- Projetos: Kanban, equipa, tempo, custos via `Entry.projectId`, rentabilidade derivada
- Agenda: eventos, renovações com antecedência, notificações
- Documentos: upload S3 com URLs assinadas, associação a entidades, expiração com alerta
- RH: fichas, férias/faltas com aprovação (dados pessoais → RBAC estrito)
- Relatórios: exportação PDF/Excel/CSV via fila `exports`, relatórios agendados

**Critério de saída por módulo:** checklist "Definição de Pronto" do PRODUCT.md + teste de isolamento de tenant.

## Fase 6 — Mobile + Offline (semana 23+)

- Expo app com módulos prioritários: Tarefas, CRM, Inventário-consulta, Dashboard
- Outbox local com `operationId` idempotente; sincronização por entidade; indicador de sync
- Push notifications (alertas críticos: stock, vencimentos)

**Critérios de saída:**
- [ ] Criar tarefa e registar movimento de stock em modo avião → sincroniza ao voltar a rede
- [ ] Conflito (edição no telemóvel e no desktop) resolve por last-write-wins com auditoria do valor sobreposto

## Fase 7 — Comercialização

- Billing: planos, trial 14 dias, cobrança AOA/USD (Multicaixa Express, transferência, referências), bloqueios suaves no fim do trial
- Onboarding guiado por setor (importação assistida, módulos sugeridos)
- Página pública + telemetria de ativação (tempo até primeiro valor, funil de onboarding)
- Preparação de suporte: exportação total do tenant, ferramentas de admin interno

---

## Prompts prontos (colar no Claude Code)

**Arranque (Fase 0):**
> Lê o CLAUDE.md e docs/. Implementa a Fase 0 do ROADMAP.md. Apresenta primeiro o plano de ficheiros e configurações; depois de eu confirmar, cria o monorepo completo com CI a verde.

**Cada fase seguinte:**
> Estamos a iniciar a Fase N do docs/ROADMAP.md. Propõe o plano de implementação (schema Prisma conforme docs/DATA-MODEL.md, endpoints, ecrãs, testes) em blocos que caibam em PRs pequenos. Espera a minha confirmação antes de codificar.

**Fechar uma fase:**
> Verifica os critérios de saída da Fase N do ROADMAP.md um a um, correndo os testes que os provam. Reporta o que falta com ficheiro:linha; não marques a fase como concluída com critérios em aberto.

**Funcionalidade avulsa:** `/feature <descrição>` · **Módulo novo:** `/module <nome>` · **Schema:** `/db-change <alteração>` · **IA:** `/ai-feature <capacidade>` · **Antes de merge:** `/fluxa-review`
