# FLUXA — Modelo de Dados de Referência

Referência para orientar as migrações reais — **não é uma migração**. O schema evolui por fases (ver ROADMAP.md); este documento define o núcleo e os padrões que cada modelo novo tem de seguir.

## Convenções (resumo do CLAUDE.md)

- `id String @id @default(cuid())` em tudo
- Modelos de negócio: `tenantId` + `@@index([tenantId, ...])` composto pelos acessos reais
- `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt`; `deletedAt DateTime?` para soft delete
- Dinheiro: `amountCents Int` + `currency String @db.Char(3)`; conversões registam `exchangeRate Decimal`
- Datas em UTC; enums para estados; tabelas em inglês no plural (`@@map("snake_case")`)

## Núcleo da plataforma (Fase 1)

```prisma
model Tenant {
  id           String    @id @default(cuid())
  name         String
  slug         String    @unique
  sector       String?
  baseCurrency String    @db.Char(3) // ex.: AOA
  timezone     String    @default("Africa/Luanda")
  locale       String    @default("pt-PT")
  plan         Plan      @default(STARTER)
  trialEndsAt  DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  deletedAt    DateTime?

  memberships  Membership[]
  @@map("tenants")
}

enum Plan { STARTER GROWTH BUSINESS ENTERPRISE }

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String
  locale        String    @default("pt-PT")
  totpSecret    String?   // 2FA opcional
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  memberships   Membership[]
  @@map("users")
}

// Um utilizador pode pertencer a vários tenants (contabilista externo, consultor)
model Membership {
  id        String   @id @default(cuid())
  tenantId  String
  userId    String
  role      Role     @default(STAFF)
  // permissões extra/custom além do papel; formato "module:action"
  permissions String[]
  status    MembershipStatus @default(ACTIVE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  tenant    Tenant @relation(fields: [tenantId], references: [id])
  user      User   @relation(fields: [userId], references: [id])
  @@unique([tenantId, userId])
  @@index([tenantId, role])
  @@map("memberships")
}

enum Role { OWNER ADMIN MANAGER STAFF }
enum MembershipStatus { ACTIVE SUSPENDED }

model Invitation {
  id        String   @id @default(cuid())
  tenantId  String
  email     String
  role      Role     @default(STAFF)
  token     String   @unique
  expiresAt DateTime
  acceptedAt DateTime?
  createdAt DateTime @default(now())

  @@index([tenantId, email])
  @@map("invitations")
}

model AuditLog {
  id        String   @id @default(cuid())
  tenantId  String
  userId    String?  // null = sistema/job
  action    String   // "customer.updated", "stock_movement.created"
  entity    String
  entityId  String
  before    Json?
  after     Json?
  ip        String?
  createdAt DateTime @default(now())

  @@index([tenantId, entity, entityId])
  @@index([tenantId, createdAt])
  @@map("audit_logs")
}

model Notification {
  id        String    @id @default(cuid())
  tenantId  String
  userId    String
  type      String    // "stock.below_minimum", "task.assigned", ...
  title     String    // chave i18n + params em payload
  payload   Json
  readAt    DateTime?
  createdAt DateTime  @default(now())

  @@index([tenantId, userId, readAt])
  @@map("notifications")
}

model ExchangeRate {
  id        String   @id @default(cuid())
  tenantId  String
  from      String   @db.Char(3)
  to        String   @db.Char(3)
  rate      Decimal  @db.Decimal(18, 8)
  source    String   // "manual" | "bna" | provider
  validAt   DateTime
  createdAt DateTime @default(now())

  @@index([tenantId, from, to, validAt])
  @@map("exchange_rates")
}
```

## CRM (Fase 2)

```prisma
model Customer {
  id        String    @id @default(cuid())
  tenantId  String
  name      String
  email     String?
  phone     String?
  taxId     String?   // NIF — dado, nunca validação fiscal
  tags      String[]
  notes     String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  @@index([tenantId, name])
  @@map("customers")
}

model Lead {
  id         String     @id @default(cuid())
  tenantId   String
  name       String
  contact    String?
  valueCents Int?
  currency   String?    @db.Char(3)
  stageId    String     // → PipelineStage
  ownerId    String?    // Membership responsável
  source     String?
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
  deletedAt  DateTime?

  @@index([tenantId, stageId])
  @@map("leads")
}

model PipelineStage {
  id       String @id @default(cuid())
  tenantId String
  name     String // chave i18n para stages default; texto livre para custom
  order    Int
  isWon    Boolean @default(false)
  isLost   Boolean @default(false)

  @@unique([tenantId, order])
  @@map("pipeline_stages")
}

// Atividades (notas, chamadas, follow-ups) ligadas a cliente ou lead
model Activity {
  id          String       @id @default(cuid())
  tenantId    String
  customerId  String?
  leadId      String?
  authorId    String
  type        ActivityType
  content     String
  dueAt       DateTime?    // follow-ups
  completedAt DateTime?
  createdAt   DateTime     @default(now())

  @@index([tenantId, customerId])
  @@index([tenantId, dueAt])
  @@map("activities")
}

enum ActivityType { NOTE CALL MEETING FOLLOW_UP }
```

## Inventário (Fase 3)

```prisma
model Product {
  id            String    @id @default(cuid())
  tenantId      String
  sku           String
  name          String
  categoryId    String?
  unit          String    @default("un")
  costCents     Int?      // custo médio; recalculado nas entradas
  priceCents    Int?
  currency      String    @db.Char(3)
  minStock      Int?      // alerta de mínimo (por produto; por armazém em StockItem)
  trackBatches  Boolean   @default(false) // lotes/validades (v2)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  @@unique([tenantId, sku])
  @@index([tenantId, name])
  @@map("products")
}

model Warehouse {
  id       String @id @default(cuid())
  tenantId String
  name     String
  location String?

  @@map("warehouses")
}

// Quantidade atual por produto+armazém (projeção mantida por StockMovement)
model StockItem {
  id          String @id @default(cuid())
  tenantId    String
  productId   String
  warehouseId String
  quantity    Int
  minStock    Int?

  @@unique([tenantId, productId, warehouseId])
  @@map("stock_items")
}

model StockMovement {
  id            String        @id @default(cuid())
  tenantId      String
  productId     String
  warehouseId   String
  toWarehouseId String?       // transferências
  type          MovementType
  quantity      Int           // sempre positivo; o type dá o sinal
  reason        String?       // obrigatório para ADJUSTMENT
  reference     String?       // ex.: purchaseOrderId
  authorId      String
  createdAt     DateTime      @default(now())
  // Movimentos são imutáveis: correções = movimento inverso, nunca UPDATE/DELETE

  @@index([tenantId, productId, createdAt])
  @@map("stock_movements")
}

enum MovementType { IN OUT TRANSFER ADJUSTMENT }
```

## Compras (Fase 3)

```prisma
model Supplier {
  id        String    @id @default(cuid())
  tenantId  String
  name      String
  email     String?
  phone     String?
  taxId     String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  @@index([tenantId, name])
  @@map("suppliers")
}

model PurchaseOrder {
  id          String              @id @default(cuid())
  tenantId    String
  supplierId  String
  number      String              // sequência por tenant: PO-2026-0001
  status      PurchaseOrderStatus @default(DRAFT)
  currency    String              @db.Char(3)
  totalCents  Int                 @default(0) // derivado dos items
  expectedAt  DateTime?
  authorId    String
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt

  items       PurchaseOrderItem[]
  @@unique([tenantId, number])
  @@index([tenantId, status])
  @@map("purchase_orders")
}

enum PurchaseOrderStatus { DRAFT SENT PARTIALLY_RECEIVED RECEIVED CLOSED CANCELLED }

model PurchaseOrderItem {
  id             String @id @default(cuid())
  tenantId       String
  orderId        String
  productId      String
  quantity       Int
  receivedQty    Int    @default(0)
  unitPriceCents Int
  order          PurchaseOrder @relation(fields: [orderId], references: [id])

  @@index([tenantId, orderId])
  @@map("purchase_order_items")
}
```

A receção cria `StockMovement(type: IN, reference: orderId)` e atualiza `receivedQty`; quando tudo recebido → `RECEIVED` e gera conta a pagar no Financeiro (evento de domínio, não acoplamento direto).

## Financeiro (Fase 2 + expansões)

```prisma
// Lançamento financeiro: receita ou despesa. NUNCA é uma fatura.
model Entry {
  id           String      @id @default(cuid())
  tenantId     String
  type         EntryType
  status       EntryStatus @default(CONFIRMED) // contas a pagar/receber = PENDING + dueAt
  description  String
  categoryId   String?
  costCenterId String?
  customerId   String?     // rentabilidade por cliente
  projectId    String?     // rentabilidade por projeto
  supplierId   String?
  amountCents  Int
  currency     String      @db.Char(3)
  // conversão para moeda base registada no momento
  baseAmountCents Int
  exchangeRate    Decimal  @db.Decimal(18, 8)
  occurredAt   DateTime
  dueAt        DateTime?   // pendentes
  paidAt       DateTime?
  authorId     String
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  deletedAt    DateTime?

  @@index([tenantId, type, occurredAt])
  @@index([tenantId, status, dueAt])
  @@map("entries")
}

enum EntryType { INCOME EXPENSE }
enum EntryStatus { PENDING CONFIRMED CANCELLED }

model Category {
  id       String    @id @default(cuid())
  tenantId String
  type     EntryType
  name     String
  @@unique([tenantId, type, name])
  @@map("categories")
}

model CostCenter {
  id       String @id @default(cuid())
  tenantId String
  name     String
  @@unique([tenantId, name])
  @@map("cost_centers")
}

model Budget {
  id          String   @id @default(cuid())
  tenantId    String
  categoryId  String?
  costCenterId String?
  periodStart DateTime // mês normalizado
  amountCents Int
  currency    String   @db.Char(3)
  @@index([tenantId, periodStart])
  @@map("budgets")
}
```

## Restantes módulos — entidades principais

Modelação completa acontece na fase respetiva, seguindo os mesmos padrões:

| Módulo | Entidades | Notas |
|---|---|---|
| **Tarefas** (F2) | `Task` (título, responsável, prioridade, dueAt, status, checklist Json), `TaskComment` | status: TODO / IN_PROGRESS / DONE / CANCELLED |
| **Projetos** (F5) | `Project`, `ProjectMember`, `TimeEntry` (minutos, membershipId, data) | custos via `Entry.projectId`; rentabilidade é derivada, não guardada |
| **Agenda** (F5) | `CalendarEvent`, `Renewal` (entidade, expiresAt, antecedência de aviso) | renovações geram notificações via evento |
| **Documentos** (F5) | `Document` (s3Key, mime, size, entidade associada, expiresAt), `DocumentTag` | ficheiros em S3; BD guarda só metadados |
| **RH** (F5) | `Employee` (ligação opcional a User), `LeaveRequest` (tipo, período, status de aprovação) | dados pessoais → RBAC estrito, minimização |
| **Relatórios** (F5) | `SavedReport` (spec Json), `ScheduledReport` (cron, destinatários, formato) | specs versionadas; exportações via fila |
| **IA** (F4) | `AiConversation`, `AiMessage` (role, content, tokens, costMicros), `Embedding` (pgvector, entidade origem) | custo por tenant agregável; embeddings recalculados por evento |

## Regras transversais

1. **Sequências por tenant** (números de ordens, etc.): tabela `counters` (tenantId, key, value) com incremento transacional — nunca `MAX()+1`
2. **Projeções** (ex.: `StockItem.quantity`, `PurchaseOrder.totalCents`) são mantidas em transação com o facto que as altera; um job de reconciliação valida-as todas as noites
3. **Imutabilidade de factos**: movimentos de stock e lançamentos confirmados não se editam — corrigem-se com contra-movimento/estorno (auditável)
4. **Soft delete**: `deletedAt` filtrado por defeito na Prisma extension; purga definitiva é um job agendado (direito ao apagamento)
5. **Índices**: cada query nova de lista tem de bater num índice `[tenantId, ...]` — verificar `EXPLAIN` na revisão de migrações (`/db-change` faz este checklist)
