# AngoStay 🏠🇦🇴

> Plataforma de reservas de alojamento para Angola — moderna, segura e adaptada ao mercado angolano.

A **AngoStay** liga proprietários (anfitriões) a hóspedes: turistas nacionais e internacionais,
empresários, expatriados, estudantes e famílias. Suporta imóveis particulares, guest houses,
pensões, apart-hotéis e hotéis.

## 🗂 Estrutura do monorepo

```
angostay/
├── docs/                  # Entregáveis de produto e engenharia
│   ├── 01-pesquisa-ux.md        # Pesquisa UX (personas, jornadas, benchmark)
│   ├── 02-arquitetura.md        # Arquitetura do sistema
│   ├── 03-wireframes.md         # Wireframes (todas as páginas)
│   ├── 04-design-system.md      # Design System (tokens, componentes)
│   ├── 05-base-de-dados.md      # Modelo relacional + dicionário de dados
│   ├── 06-api.md                # Especificação da API REST
│   ├── 07-seguranca.md          # Segurança, LGPD/GDPR
│   ├── 08-seo-performance.md    # SEO e performance
│   └── 09-deploy.md             # Guia de deploy (Docker, Vercel, Railway/AWS)
├── apps/
│   ├── api/               # Backend — NestJS + Prisma + PostgreSQL + Redis
│   └── web/               # Frontend — Next.js (App Router) + Tailwind CSS
├── docker-compose.yml     # Ambiente completo local (db, cache, api, web)
└── README.md
```

## 🚀 Arranque rápido

Pré-requisitos: Node.js ≥ 20, Docker e Docker Compose.

```bash
# 1. Ambiente completo com Docker
cd angostay
docker compose up --build

# 2. Ou em modo de desenvolvimento
cd apps/api && cp .env.example .env && npm install
npx prisma migrate dev && npx prisma db seed
npm run start:dev            # API em http://localhost:4000

cd ../web && cp .env.example .env.local && npm install
npm run dev                  # Web em http://localhost:3000
```

Documentação interativa da API (Swagger): `http://localhost:4000/docs`.

## 🧱 Stack

| Camada | Tecnologias |
| --- | --- |
| Frontend | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Node.js 20, NestJS 10, PostgreSQL 16, Prisma ORM, Redis 7 |
| Autenticação | JWT (access + refresh), OAuth Google/Facebook, 2FA TOTP |
| Storage | Cloudinary / AWS S3 (upload assinado) |
| Mapas | Google Maps / OpenStreetMap (adaptador configurável) |
| Pagamentos | Multicaixa Express, Unitel Money, Afrimoney, Visa, Mastercard (gateway plugável) |
| Notificações | Email (SMTP/SES), SMS, WhatsApp Business API |
| Deploy | Docker, Vercel (web), Railway/AWS (api), GitHub Actions CI/CD |

## 🌍 Idiomas

Português (padrão) · English · Français — ver `apps/web/src/lib/i18n.ts`.

## 📄 Licença

Proprietário — todos os direitos reservados.
