# AngoStay — Segurança e Privacidade

## 1. Autenticação e sessões

- **Senhas**: `argon2id` (memoryCost 64 MB, timeCost 3); política mínima 8 chars com verificação
  contra listas de senhas vazadas.
- **JWT**: access token 15 min (assinatura RS256, chaves rodadas), refresh token 30 dias em
  cookie `httpOnly; Secure; SameSite=Strict`, com **rotação e deteção de reuso** (família de
  tokens revogada em Redis ao detetar replay).
- **2FA TOTP** (RFC 6238) com códigos de recuperação; obrigatório para ADMIN e anfitriões
  com repasses ativos.
- **OAuth** Google/Facebook: `state` + PKCE; contas ligadas por email verificado.

## 2. Proteções aplicacionais

| Ameaça | Mitigação |
| --- | --- |
| SQL Injection | Prisma (queries parametrizadas); zero SQL concatenado; raw SQL só com placeholders |
| XSS | React escapa por defeito; CSP estrita (`default-src 'self'`); sanitização de HTML em descrições (allowlist); `X-Content-Type-Options` |
| CSRF | API stateless com Bearer token; cookies de refresh `SameSite=Strict` + double-submit token no endpoint de refresh |
| Rate limiting / brute force | ThrottlerGuard + Redis: 20/min em `/auth`, backoff progressivo, CAPTCHA após 5 falhas |
| IDOR | Guards de ownership em todos os recursos (`propertyId → hostId`, reservas por dono) |
| Upload malicioso | Upload assinado direto para Cloudinary/S3; validação de MIME/magic bytes; imagens re-processadas |
| Webhooks forjados | Assinatura HMAC verificada + idempotência por `providerRef` + allowlist de IPs |
| Enumeração | Respostas uniformes em login/recuperação ("se existir, enviámos email") |
| Headers | `helmet`: HSTS (2 anos, preload), frame-deny, referrer-policy |

## 3. Criptografia

- TLS 1.2+ obrigatório em todo o tráfego; HSTS.
- Em repouso: discos cifrados (AES-256) na base e storage; campos sensíveis
  (nº documento de identidade, segredo TOTP) cifrados a nível de coluna (AES-256-GCM,
  chave em KMS/secret manager, rotação anual).
- Segredos nunca no repositório — `.env` local, secret manager em produção; scan de
  segredos no CI (gitleaks).

## 4. Antifraude (marketplace)

- Score de risco por reserva: velocidade de tentativas, mismatch país do cartão/IP,
  contas recém-criadas com valores altos, reutilização de dispositivo (fingerprint).
- Retenção do repasse (escrow) até check-in confirmado; reembolso automático por política.
- Verificação de identidade (BI/passaporte + selfie) e verificação física/documental do imóvel.
- Fila de revisão manual para reservas de alto risco; bloqueio de contas com chargebacks.

## 5. Auditoria, logs e backups

- `audit_logs` imutável: quem, o quê, antes/depois, IP, user-agent — todas as ações
  administrativas e financeiras.
- Logs estruturados sem PII (pino + redaction de email/telefone/tokens), retenção 90 dias.
- Backups: PITR contínuo + snapshot diário (30 dias) + restore testado mensalmente;
  RPO ≤ 5 min, RTO ≤ 1 h.

## 6. LGPD / GDPR ready

- **Base legal e minimização**: recolhe-se apenas o necessário; consentimento explícito
  para marketing; registos de consentimento com timestamp.
- **Direitos do titular**: exportação de dados (`GET /users/me/export`, JSON),
  retificação, eliminação (soft-delete imediato + purga/anonimização em 30 dias,
  preservando registos financeiros exigidos por lei).
- **DPA** com subprocessadores (Cloudinary, AWS, gateways); registo de tratamento;
  DPO nomeado; procedimento de notificação de violações ≤ 72 h.
- Política de Privacidade e Termos versionados (páginas `/privacidade` e `/termos`).

## 7. SDLC seguro

- CI: `npm audit` + Dependabot, SAST (CodeQL), gitleaks, testes de guards de autorização.
- Revisão de código obrigatória; ambientes segregados (dev/staging/prod) com dados
  sintéticos fora de produção; pentest anual + programa de divulgação responsável.
