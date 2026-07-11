# AngoStay — API REST

Base URL: `https://api.angostay.ao/v1` · JSON · OpenAPI/Swagger em `/docs`.
Autenticação: `Authorization: Bearer <accessToken>` (JWT 15 min) + refresh token httpOnly.
Idioma: header `Accept-Language: pt|en|fr`. Paginação: `?page=1&limit=20` →
`{ data, meta: { page, limit, total, totalPages } }`. Erros: RFC 7807
`{ statusCode, error, message, path, timestamp }`.

## Autenticação `/auth`

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/auth/register` | Criar conta (nome, email, telefone, senha, papel GUEST/HOST) |
| POST | `/auth/login` | Login email+senha → tokens (ou desafio 2FA) |
| POST | `/auth/2fa/verify` | Confirma código TOTP e emite tokens |
| POST | `/auth/2fa/enable` · `/auth/2fa/disable` | Gestão 2FA (autenticado) |
| POST | `/auth/refresh` | Roda o refresh token (rotação + deteção de reuso) |
| POST | `/auth/logout` | Revoga refresh token |
| GET | `/auth/google` · `/auth/facebook` | Início do fluxo OAuth (callback `/auth/*/callback`) |
| POST | `/auth/forgot-password` | Email com token de recuperação (15 min) |
| POST | `/auth/reset-password` | Define nova senha |

## Utilizadores `/users`

| GET | `/users/me` | Perfil próprio | PATCH `/users/me` · DELETE `/users/me` (soft) |
| POST | `/users/me/identity-verification` | Submete BI/passaporte + selfie |
| GET | `/users/:id/public` | Perfil público (anfitrião) |

## Imóveis `/properties`

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/properties` | Pesquisa: `city, checkIn, checkOut, guests, minPrice, maxPrice, type, amenities[], verified, bbox, sort, page` |
| GET | `/properties/:slug` | Detalhe público (fotos, comodidades, avaliações, anfitrião) |
| GET | `/properties/:id/availability?month=` | Datas ocupadas/bloqueadas |
| POST | `/properties` | Criar (HOST) — estado DRAFT |
| PATCH | `/properties/:id` | Editar (dono ou ADMIN) |
| POST | `/properties/:id/publish` | Submete para revisão |
| DELETE | `/properties/:id` | Desativar |
| POST | `/properties/:id/photos` | Upload assinado (Cloudinary/S3) |
| POST | `/properties/:id/blocks` | Bloquear datas |
| GET | `/cities` · `/amenities` | Catálogos |

## Reservas `/reservations`

| POST | `/reservations` | `{ propertyId, checkIn, checkOut, guests, couponCode? }` → PENDING (30 min p/ pagar) |
| GET | `/reservations` | Minhas (`role=guest|host`, `status=`) |
| GET | `/reservations/:code` | Detalhe + QR Code de check-in |
| POST | `/reservations/:code/cancel` | Cancela conforme política → reembolso automático |
| POST | `/reservations/:code/check-in` | Valida QR token (anfitrião) |

## Pagamentos `/payments`

| POST | `/payments/checkout` | `{ reservationCode, method }` → instruções do provedor |
| POST | `/payments/webhook/:provider` | Webhook assinado, idempotente por `providerRef` |
| GET | `/payments` | Histórico próprio; recibo `GET /payments/:id/receipt` |
| POST | `/coupons/validate` | Valida cupão para um total |

## Social

- **Avaliações**: `POST /reviews` (só reserva COMPLETED), `GET /properties/:id/reviews`,
  `POST /reviews/:id/reply` (anfitrião).
- **Favoritos**: `GET/POST/DELETE /favorites` (`propertyId`).
- **Mensagens**: `GET /conversations`, `GET /conversations/:id/messages`,
  `POST /conversations/:id/messages`; WebSocket `wss:///chat` (eventos `message.new`, `message.read`).
- **Notificações**: `GET /notifications`, `POST /notifications/:id/read`.
- **Denúncias**: `POST /reports` `{ targetType, targetId, reason }`.

## Administração `/admin` (papel ADMIN/MODERATOR)

| GET/PATCH | `/admin/users` | Lista, suspende, aprova verificações de identidade |
| GET/PATCH | `/admin/properties` | Modera anúncios, aprova verificação de imóvel |
| GET | `/admin/reservations` · `/admin/payments` | Vistas globais, reembolsos manuais |
| GET | `/admin/reports` · PATCH `/admin/reports/:id` | Fila de moderação |
| GET | `/admin/metrics` | GMV, comissões, ocupação, fraude |
| GET | `/admin/audit-logs` | Trilha de auditoria filtrável |

## Regras transversais

- **Rate limiting**: 100 req/min por IP (público), 20/min em `/auth/*` (Redis).
- **Idempotência**: header `Idempotency-Key` aceite em POST de reservas/pagamentos.
- **Versionamento**: prefixo `/v1`; alterações breaking → `/v2`.
- **Webhooks de saída** (para anfitriões com PMS): assinatura HMAC-SHA256, retries exponenciais.
