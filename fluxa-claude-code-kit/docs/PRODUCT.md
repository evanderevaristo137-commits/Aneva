# FLUXA — Especificação de Produto

## Identidade

A **Fluxa** é um **Business Operating System (Business OS)**: plataforma SaaS de gestão empresarial com IA nativa. O centro de comando da empresa — operações, indicadores, equipas e decisões num só lugar. O primeiro sistema que o gestor abre de manhã e o último que consulta à noite.

**Missão:** dar aos gestores uma visão completa e em tempo real da empresa numa única plataforma.
**Visão:** ser a plataforma de gestão empresarial mais moderna de África, preparada para escalar globalmente.

### O que a Fluxa NÃO é

- NÃO é software de faturação; NÃO emite documentos fiscais nem faturas certificadas
- NÃO substitui programas certificados (ex.: certificados pela AGT em Angola)
- NÃO é contabilidade formal (plano de contas, balancetes, declarações fiscais)
- NÃO é processamento salarial bancário nem plataforma de pagamentos
- NÃO é e-commerce nem ponto de venda (POS) — pode integrar-se com ambos no futuro
- Integra-se com softwares certificados via API ou importação (CSV, XML, SAF-T)

Quando um pedido de funcionalidade cair numa destas zonas, a resposta é "não, e aqui está a alternativa" — normalmente uma integração ou exportação.

## Posicionamento

| Alternativa atual do cliente | Porque perde para a Fluxa |
|---|---|
| Excel + WhatsApp + papel | Dados dispersos, sem histórico, sem alertas, um erro de fórmula custa dinheiro |
| ERPs tradicionais (pesados) | Caros, lentos, precisam de consultores, UX de 2005, não funcionam offline |
| Apps pontuais (só stock, só CRM) | Cinco logins, zero visão integrada, dados que não conversam |
| Nada (gestão de cabeça) | O gestor não sabe se teve lucro este mês — a Fluxa responde em 30 segundos |

**Diferenciais:** IA nativa em português · offline-first · mobile-first real · multi-moeda desde o dia 1 · UX de classe mundial a preço de PME africana.

## Contexto de Mercado

- Mercado inicial: Angola e África lusófona → depois África → global
- Conectividade instável é comum → **offline-first é requisito**, não opção
- Multi-moeda desde o dia 1 (AOA, USD, EUR, ZAR…) com câmbio configurável
- Idiomas: pt-PT/pt-AO primeiro; en e fr a seguir (i18n desde o início)
- Mobile-first real: muitos utilizadores só têm telemóvel
- Pagamentos SaaS locais: Multicaixa Express, transferência, referências

## Personas

| Persona | Perfil | O que precisa |
|---|---|---|
| **O Dono** | Gestor de PME, pouco tempo | Estado do negócio em 30 s; alertas acionáveis |
| **A Gestora Operacional** | Coordena equipa, stock, compras | Processos claros, tarefas atribuídas, zero Excel paralelo |
| **O Financeiro** | Controla caixa e contas | Números fiáveis, exportações limpas, conciliação rápida |
| **O Colaborador** | Usa 1–2 módulos no telemóvel | Simples, rápido, funciona offline |

Regra: se uma funcionalidade não serve claramente pelo menos uma persona, não existe.

## Jornadas de Referência

### Onboarding (primeiros 15 minutos → primeiro valor)

1. Registo da empresa: nome, setor, moeda base, fuso — 4 campos, nada mais
2. A Fluxa propõe módulos ativos conforme o setor (ex.: farmácia → inventário com lotes/validades)
3. Importação assistida: CSV de clientes e/ou produtos com mapeamento automático de colunas (IA sugere o mapeamento; o utilizador confirma)
4. Primeiro valor: o dashboard mostra algo verdadeiro sobre a empresa (nem que seja "5 clientes importados, 32 produtos, define o teu primeiro objetivo")
5. Convites à equipa por email/WhatsApp com papel pré-atribuído

**Meta de ativação:** tenant com dados reais e ≥ 2 utilizadores ativos em 7 dias.

### Dia típico do Dono

Abre a app (mobile) → resumo diário da IA no topo do dashboard: "Ontem: 340 000 AOA em receitas, 2 pagamentos em atraso, o stock de X acaba em ~6 dias" → toca num alerta → vê o detalhe → delega: "cria tarefa para a Marta cobrar o cliente Y" → confirmação → fecha a app. Total: menos de 2 minutos.

### Fluxo da Gestora Operacional

Recebe alerta de stock mínimo → abre a sugestão de reposição (IA já propôs quantidades pelo histórico) → ajusta → gera ordem de compra → o fornecedor recebe PDF por email → na entrega, receção parcial pelo telemóvel → stock atualizado, auditoria registada, financeiro vê a conta a pagar.

## Filosofia de Produto

1. Cada funcionalidade resolve um problema real e mensurável
2. Simplicidade vence quantidade: menos ecrãs, menos cliques, menos texto
3. Cada clique acrescenta valor; cada ecrã responde a uma pergunta do gestor
4. A IA elimina trabalho — não decora o produto
5. Padrões inteligentes por defeito; configuração avançada escondida até ser precisa
6. Velocidade percebida é uma funcionalidade
7. Dizer "não" a funcionalidades é tão importante como construí-las

## Módulos

Cada módulo responde a uma pergunta do gestor. Visão geral:

| Módulo | Pergunta | Capacidades principais |
|---|---|---|
| **Dashboard Executivo** | "Como está a minha empresa agora?" | KPIs configuráveis, receitas, despesas, lucro estimado, fluxo de caixa, objetivos vs. real, alertas, resumo diário por IA |
| **CRM** | "Quem são os meus clientes e o que faço a seguir?" | Clientes, leads, pipeline visual, histórico, follow-ups, notas, etiquetas, tarefas, deteção de clientes inativos (IA) |
| **Inventário** | "O que tenho, onde está, o que reponho?" | Produtos, variantes, categorias, multi-armazém, entradas/saídas/transferências/ajustes com auditoria, stock mínimo, lotes, validades, previsão de rutura (IA) |
| **Compras** | "O que compro e a quem?" | Fornecedores, pedidos, ordens, receção, histórico de preços, estados, pagamentos, sugestão de reposição (IA) |
| **Financeiro** | "Para onde vai o dinheiro e quanto vou ter?" | Receitas, despesas, caixa realizado/projetado, contas a pagar/receber, centros de custo, orçamentos, rentabilidade por produto/cliente/projeto, multi-moeda. **Nunca emissão fiscal** |
| **RH** | "Como está a equipa?" | Funcionários, equipas, férias, faltas, escalas, avaliações, documentos |
| **Projetos** | "Este projeto dá lucro e acaba a tempo?" | Kanban, cronograma, equipa, tempo, custos, rentabilidade em tempo real |
| **Tarefas** | "O que tem de ser feito, por quem, até quando?" | Checklists, comentários, prioridades, responsáveis, datas, notificações |
| **Agenda** | "O que não posso deixar escapar?" | Eventos, compromissos, renovações (contratos, licenças), lembretes, calendário partilhado |
| **Documentos** | "Onde está aquele documento?" | Contratos, PDFs, imagens, licenças, garantias, pesquisa, pré-visualização, alertas de expiração |
| **Relatórios** | "Mostra-me a resposta, não dados em bruto" | Dashboards, filtros, comparações, exportação (PDF/Excel/CSV), relatórios agendados, geração em linguagem natural (IA) |

### Especificação por módulo (v1 vs. v2)

Cada módulo entra com um **v1 mínimo mas completo** (estados de UI, RBAC, auditoria, i18n) e uma lista explícita do que fica para v2 — para dizer "não, ainda não" com fundamento.

**Dashboard Executivo** — permissões: `dashboard:read` (todos), configuração `dashboard:manage`
- v1: KPIs de receitas/despesas/lucro do período, comparação com período anterior, alertas dos módulos ativos, resumo diário por IA
- v2: KPIs configuráveis por utilizador, objetivos vs. real, widgets por módulo, partilha de snapshot
- KPI do módulo: % de dias em que o Dono abre o dashboard (meta: hábito diário)

**CRM** — permissões: `crm:read`, `crm:write`, `crm:manage` (pipeline/etiquetas)
- v1: clientes e leads (CRUD), pipeline Kanban com etapas configuráveis, notas e follow-ups com lembrete, etiquetas
- v2: deteção de clientes inativos (IA), scoring de leads, importação avançada, campos personalizados
- KPI: follow-ups concluídos no prazo

**Inventário** — permissões: `inventory:read`, `inventory:write`, `inventory:manage` (armazéns/ajustes)
- v1: produtos, categorias, multi-armazém, movimentos (entrada/saída/transferência/ajuste) com motivo e auditoria, stock mínimo com alerta
- v2: variantes, lotes e validades (setor farmácia/alimentar), código de barras, previsão de rutura (IA), inventário físico (contagem)
- KPI: ruturas evitadas (alertas atendidos antes de stock 0)

**Compras** — permissões: `purchases:read`, `purchases:write`, `purchases:approve`
- v1: fornecedores, ordens de compra com máquina de estados (DRAFT → SENT → PARTIALLY_RECEIVED → RECEIVED → CLOSED/CANCELLED), receção que movimenta stock, conta a pagar gerada
- v2: sugestão de reposição (IA), histórico e comparação de preços por fornecedor, aprovações multi-nível
- KPI: tempo de ciclo ordem → receção

**Financeiro** — permissões: `finance:read`, `finance:write`, `finance:manage` (categorias/centros de custo)
- v1: receitas e despesas manuais, categorias, contas a pagar/receber com estados e datas, caixa realizado por período, multi-moeda com taxa registada
- v2: caixa projetado, centros de custo, orçamentos com alerta de desvio, rentabilidade por produto/cliente/projeto, conciliação por importação de extrato
- KPI: % de lançamentos feitos no próprio dia (frescura dos dados)

**Tarefas** — permissões: `tasks:read`, `tasks:write`
- v1: CRUD, responsável, prioridade, data limite, checklist, comentários, notificações in-app
- v2: tarefas recorrentes, dependências, vistas por equipa, SLA
- KPI: tarefas concluídas no prazo

**Projetos** — permissões: `projects:read`, `projects:write`, `projects:manage`
- v1: projetos com Kanban próprio, equipa, registo de tempo, custos associados (despesas ligadas ao projeto)
- v2: cronograma (Gantt leve), rentabilidade em tempo real (receitas − custos − tempo × custo/hora), templates de projeto
- KPI: projetos com margem visível

**Agenda** — permissões: `calendar:read`, `calendar:write`
- v1: eventos, lembretes, renovações com antecedência configurável (contratos, licenças, seguros)
- v2: calendário partilhado por equipa, sincronização externa (Google/Outlook)
- KPI: renovações tratadas antes do prazo

**Documentos** — permissões: `documents:read`, `documents:write`, `documents:manage`
- v1: upload (S3), organização por entidade (cliente, fornecedor, funcionário, projeto), pré-visualização, data de expiração com alerta
- v2: pesquisa full-text + semântica (RAG), versões, assinaturas de leitura
- KPI: documentos encontrados em < 10 s

**RH** — permissões: `hr:read`, `hr:write`, `hr:manage`
- v1: ficha de funcionário, equipas, férias e faltas com aprovação, documentos do funcionário
- v2: escalas, avaliações, onboarding de colaborador
- KPI: pedidos de férias resolvidos em < 48 h
- Nota: RH guarda dados pessoais → atenção redobrada a RBAC e minimização

**Relatórios** — permissões: `reports:read`, `reports:manage` (agendados)
- v1: relatórios por módulo com filtros e comparação de períodos, exportação PDF/Excel/CSV
- v2: relatórios agendados por email, construtor visual, geração em linguagem natural (IA)
- KPI: relatórios exportados/agendados por tenant

## Inteligência Artificial (diferencial principal)

### Capacidades

- Linguagem natural em português (incl. variantes angolanas) e inglês
- Responde com clareza; gera gráficos, tabelas e ações concretas
- Identifica tendências, anomalias e oportunidades **proativamente**
- Executa ações com confirmação ("cria uma tarefa para o João rever o stock")

Perguntas de referência que deve dominar: "Quanto gastei este mês?" · "Quem ainda não pagou?" · "Produto mais vendido?" · "Custos deste projeto?" · "Clientes que deixaram de comprar?" · "Produtos abaixo do stock mínimo?" · "Cria um relatório para a direção" · "Resume o desempenho desta semana" · "Despesas que aumentaram nos últimos 3 meses?"

### Onde a IA aparece (UX)

1. **Cmd/Ctrl+K → perguntar**: a paleta universal aceita perguntas em linguagem natural
2. **Resumo diário** no topo do dashboard: 3–5 frases, só factos com fonte, com ações de um toque
3. **Insights contextuais** por ecrã: no CRM sugere follow-ups; no inventário, reposição; no financeiro, anomalias de despesa
4. **Ações com confirmação**: a IA propõe (criar tarefa, marcar follow-up, gerar ordem) e o utilizador confirma — nunca executa ações financeiras/destrutivas sozinha

### Guardrails

- Responde **só** com dados do tenant do utilizador
- Nunca inventa números; sem dados → diz e sugere como obtê-los
- Respostas numéricas indicam período e fonte
- Ações destrutivas/financeiras exigem confirmação
- Respeita RBAC: a IA não revela o que a interface não revelaria
- Utilização medida e limitada por plano (pedidos/mês por tenant); custos de tokens monitorizados

## Design

Referências: Stripe, Linear, Notion, Vercel, Raycast, Framer, Arc.

Premium, minimalista, extremamente rápido. Dark e light. Pouco texto, tipografia excelente, ícones Lucide, animações discretas (Framer Motion). Estados vazios que ensinam, skeletons em vez de spinners, densidade ajustável, contraste AA, navegação por teclado, `Cmd/Ctrl+K` universal.

**Regra de ouro:** qualquer ecrã compreendido em 5 segundos por quem nunca usou a Fluxa.

## Modelo de Negócio

SaaS, MRR, cobrança em AOA e USD. Trial 14 dias sem cartão. Preços locais competitivos — o concorrente real é o Excel, não o SAP.

| Plano | Alvo | Utilizadores | Módulos | IA | Extras |
|---|---|---|---|---|---|
| **Starter** | Micro empresas | 1–3 | Essenciais (Dashboard, Financeiro, CRM, Tarefas) | Resumo diário | — |
| **Growth** | Pequenas empresas | até 10 | Todos | Limite mensal de perguntas | Multi-armazém |
| **Business** | Médias empresas | até 50 | Todos | IA completa + relatórios em linguagem natural | RBAC avançado, API, webhooks |
| **Enterprise** | Grandes contas | Custom | Todos | Custom | SSO, SLA, suporte dedicado, ambiente próprio opcional |

Regras de upgrade: limites atingidos mostram o valor do plano seguinte no momento certo (ex.: 4.º utilizador no Starter) — nunca bloquear dados já criados.

Futuro: marketplace de integrações (contabilidade, bancos, e-commerce, faturação certificada).

### Métricas norte (com definição)

| Métrica | Definição operacional |
|---|---|
| **MRR** | Receita recorrente mensal normalizada em USD à taxa do dia de fecho |
| **Ativação** | Tenant com dados reais importados/criados e ≥ 2 utilizadores ativos nos primeiros 7 dias |
| **Retenção/Churn** | Tenants ativos no mês M ainda ativos em M+1; churn de logo vs. downgrade separados |
| **Tempo até primeiro valor** | Minutos entre registo e primeiro KPI verdadeiro no dashboard |
| **NPS** | Pesquisa in-app trimestral, por persona |
| **Utilização de IA** | % de tenants com ≥ 5 interações IA/semana; custo de tokens por tenant |

## Definição de "Pronto"

Uma funcionalidade só está pronta quando:

- [ ] Resolve o problema definido, para uma persona concreta
- [ ] Funciona em mobile e desktop, dark e light
- [ ] Respeita RBAC e isolamento de tenant
- [ ] Tem estados vazio/erro/carregamento desenhados
- [ ] Valida dados no frontend e no backend (Zod partilhado)
- [ ] Regista auditoria das ações relevantes
- [ ] Está preparada para i18n (zero strings hardcoded)
- [ ] `pnpm typecheck && pnpm lint && pnpm test` passam
- [ ] Cumpre metas de desempenho (p95 API < 300 ms; listas paginadas)
