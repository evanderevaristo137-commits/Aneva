# AngoStay — Base de Dados

PostgreSQL 16 · Prisma ORM. Fonte de verdade: `apps/api/prisma/schema.prisma`.

## 1. Diagrama entidade-relação (resumo)

```
User ─┬─< Property >─┬─ City >── Province ── Country
      │              ├─< Photo
      │              ├─< PropertyAmenity >── Amenity
      │              ├─< AvailabilityBlock
      │              └─< PropertyVerification
      ├─< Reservation >── Property
      │        ├── Payment ──< Transaction (ledger)
      │        ├── Review
      │        └── CouponRedemption >── Coupon
      ├─< Favorite >── Property
      ├─< Message >── Conversation (guest ↔ host, por reserva/imóvel)
      ├─< Notification
      ├─< Report (denúncias)
      ├─── IdentityVerification
      ├─< UserRole >── Role ──< RolePermission >── Permission
      └─< AuditLog
```

## 2. Dicionário de dados (tabelas principais)

| Tabela | Campos-chave | Notas |
| --- | --- | --- |
| **users** | id, name, email (único), phone, passwordHash, avatarUrl, locale, twoFactorSecret, status | OAuth: provider + providerId; soft-delete via `deletedAt` |
| **roles / permissions** | RBAC N:N via `user_roles` e `role_permissions` | Papéis semente: GUEST, HOST, ADMIN, MODERATOR |
| **identity_verifications** | userId, docType (BI/passaporte), docNumber cifrado, selfieUrl, status | PENDING → APPROVED/REJECTED por moderador |
| **countries / provinces / cities** | Angola semeada com 18 províncias e cidades principais | Pronto para multi-país |
| **properties** | hostId, cityId, slug (único, SEO), type, title, description, lat/lng, maxGuests, bedrooms, beds, bathrooms, basePriceKz, cleaningFeeKz, currency, cancellationPolicy, status, verifiedAt | `status`: DRAFT → PENDING_REVIEW → ACTIVE → SUSPENDED |
| **photos** | propertyId, url, alt, position, isCover | Cloudinary/S3 |
| **amenities / property_amenities** | Semente inclui gerador, tanque de água, wifi, AC, segurança 24h | N:N |
| **availability_blocks** | propertyId, startDate, endDate, reason | Bloqueios manuais do anfitrião |
| **reservations** | code (único, ex. `AS-3F7K2M`), guestId, propertyId, checkIn, checkOut, guests, nightlyPriceKz, nights, subtotalKz, serviceFeeKz, discountKz, totalKz, status, qrCodeToken, expiresAt | `status`: PENDING → CONFIRMED → CHECKED_IN → COMPLETED / CANCELLED / EXPIRED. **Exclusion constraint** anti-overbooking (migração SQL) |
| **payments** | reservationId, method, provider, providerRef (único → idempotência de webhooks), amountKz, feeKz, status, paidAt | métodos: MULTICAIXA_EXPRESS, UNITEL_MONEY, AFRIMONEY, VISA, MASTERCARD |
| **transactions** | ledger imutável: paymentId, type (CHARGE, COMMISSION, PAYOUT, REFUND, CASHBACK), amountKz, balanceAfterKz | dupla entrada simplificada |
| **coupons / coupon_redemptions** | code, type (PERCENT/FIXED), value, maxUses, validFrom/To, minTotalKz | limite por utilizador |
| **reviews** | reservationId (única → só quem ficou avalia), rating 1–5, categorias (limpeza, localização, valor), comment, hostReply | públicas após check-out |
| **conversations / messages** | conversation por (guest, host, property); message: senderId, body, readAt | chat em tempo real |
| **favorites** | (userId, propertyId) único | |
| **notifications** | userId, channel (EMAIL/SMS/WHATSAPP/PUSH/IN_APP), template, payload JSON, status, sentAt | fila com retries |
| **reports** | reporterId, targetType (PROPERTY/USER/REVIEW/MESSAGE), targetId, reason, status | moderação |
| **audit_logs** | actorId, action, entity, entityId, before/after JSON, ip, userAgent | imutável, retenção 2 anos |

## 3. Índices e integridade

- Únicos: `users.email`, `properties.slug`, `reservations.code`, `payments.providerRef`,
  `favorites(userId, propertyId)`, `reviews.reservationId`.
- Pesquisa: `properties(cityId, status)`, `properties(basePriceKz)`, GiST em `(lat,lng)`
  (bounding box) e **GiST de exclusão** em `reservations` sobre
  `(propertyId, daterange(checkIn, checkOut))` onde `status IN ('PENDING','CONFIRMED','CHECKED_IN')`.
- FKs com `onDelete: Restrict` em dados financeiros; `Cascade` apenas em dependentes puros
  (fotos, favoritos).
- Valores monetários em **inteiros (centavos de Kz)** — nunca float.

## 4. Migrações e seed

```bash
npx prisma migrate dev      # cria/aplica migrações
npx prisma db seed          # papéis, permissões, 18 províncias, cidades, comodidades,
                            # utilizadores demo e 6 imóveis de exemplo
```

A migração `add_reservation_exclusion` (SQL manual) adiciona a constraint anti-overbooking:

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE "reservations" ADD CONSTRAINT no_overlapping_reservations
  EXCLUDE USING gist (
    "propertyId" WITH =,
    daterange("checkIn"::date, "checkOut"::date) WITH &&
  ) WHERE (status IN ('PENDING','CONFIRMED','CHECKED_IN'));
```

## 5. Backups

- PITR (WAL) no PostgreSQL gerido + snapshot diário, retenção 30 dias, teste de restore mensal.
