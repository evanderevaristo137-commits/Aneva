# AngoStay — Deploy e Operações

## 1. Ambientes

| Ambiente | Web | API | Base de dados |
| --- | --- | --- | --- |
| Local | `next dev` :3000 | `nest start:dev` :4000 | Docker Compose (postgres, redis) |
| Staging | Vercel (preview) | Railway (serviço `api-staging`) | Railway Postgres + Redis |
| Produção | Vercel (prod) | Railway/AWS ECS (2+ réplicas) | RDS/Railway Postgres (PITR) + Redis gerido |

## 2. Docker local

```bash
cd angostay
docker compose up --build
# web:  http://localhost:3000
# api:  http://localhost:4000  (Swagger em /docs)
# db:   postgres://angostay:angostay@localhost:5432/angostay
```

O compose sobe `postgres:16`, `redis:7`, aplica migrações (`prisma migrate deploy`),
faz seed e arranca API e Web. Imagens multi-stage (Node 20-alpine, utilizador não-root,
`HEALTHCHECK` incluído).

## 3. Variáveis de ambiente

Ver `apps/api/.env.example` e `apps/web/.env.example`. Principais:

- API: `DATABASE_URL`, `REDIS_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`,
  `GOOGLE_CLIENT_ID/SECRET`, `FACEBOOK_APP_ID/SECRET`, `CLOUDINARY_URL` ou `AWS_S3_*`,
  `MCX_EXPRESS_*`, `UNITEL_MONEY_*`, `AFRIMONEY_*`, `CARD_GATEWAY_*`,
  `SMTP_*`, `SMS_*`, `WHATSAPP_TOKEN`, `WEB_URL`.
- Web: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_MAPS_PROVIDER=osm|google`,
  `NEXT_PUBLIC_GOOGLE_MAPS_KEY`.

Produção: secrets no Railway/AWS Secrets Manager e na Vercel — nunca no repositório.

## 4. CI/CD (GitHub Actions — `.github/workflows/angostay-ci.yml`)

Pipeline em cada push/PR que toque `angostay/**`:

1. **api**: install → `prisma generate` → lint → testes (Jest) → build.
2. **web**: install → lint → build Next.js.
3. **docker**: build das imagens (validação dos Dockerfiles) em pushes para `main`.

Deploy contínuo:
- **Web**: Vercel liga ao repositório (root `angostay/apps/web`) — preview por PR,
  produção no merge para `main`.
- **API**: Railway liga ao repositório (root `angostay/apps/api`, Dockerfile) — release no
  merge; `prisma migrate deploy` corre no `release command` antes de trocar o tráfego.

## 5. Checklist de produção

- [ ] Migrações aplicadas (`prisma migrate deploy`) e seed de catálogos (cidades, comodidades).
- [ ] HTTPS + HSTS; domínios `angostay.ao` (web) e `api.angostay.ao` (API); CORS restrito.
- [ ] Webhooks dos gateways apontados para `https://api.angostay.ao/v1/payments/webhook/*`
  com segredos configurados.
- [ ] Backups PITR ativos + snapshot diário; alarme de falha de backup.
- [ ] Monitorização: uptime (health checks `/health`), Sentry (erros), métricas p95/5xx.
- [ ] Rate limits e CAPTCHA ativos; 2FA obrigatório para contas ADMIN.
- [ ] Sitemap submetido ao Search Console; Lighthouse ≥ 90 nas páginas públicas.

## 6. Rollback e migrações

- Imagens Docker imutáveis por SHA → rollback = redeploy da tag anterior.
- Migrações **expand/contract**: nunca dropar colunas no mesmo release que deixa de as usar.
- Feature flags para funcionalidades de risco (novos gateways de pagamento).
