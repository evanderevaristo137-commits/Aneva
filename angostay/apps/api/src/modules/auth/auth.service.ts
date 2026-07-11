import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { createHash, randomBytes, randomUUID } from 'crypto';
import { authenticator } from 'otplib';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';

const sha256 = (v: string) => createHash('sha256').update(v).digest('hex');

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  // ── Registo e login ────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Já existe uma conta com este email.');

    const role = await this.prisma.role.findUnique({ where: { name: dto.role ?? 'GUEST' } });
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        passwordHash: await argon2.hash(dto.password),
        roles: role ? { create: [{ roleId: role.id }] } : undefined,
      },
    });
    return this.issueTokens(user.id);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { roles: { include: { role: true } } },
    });
    // Resposta uniforme — evita enumeração de contas.
    const invalid = new UnauthorizedException('Credenciais inválidas.');
    if (!user || !user.passwordHash || user.status !== 'ACTIVE') throw invalid;
    if (!(await argon2.verify(user.passwordHash, dto.password))) throw invalid;

    if (user.twoFactorEnabled) {
      // Passo intermédio: token de desafio de 5 min, só utilizável em /auth/2fa/verify.
      const challengeToken = await this.jwt.signAsync(
        { sub: user.id, email: user.email, roles: [], type: 'challenge' },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: 300 },
      );
      return { requiresTwoFactor: true, challengeToken };
    }
    return this.issueTokens(user.id);
  }

  // ── 2FA (TOTP) ─────────────────────────────────────────────────────

  async enableTwoFactor(userId: string) {
    const secret = authenticator.generateSecret();
    // Em produção o segredo é cifrado (AES-256-GCM) antes de persistir.
    await this.prisma.user.update({ where: { id: userId }, data: { twoFactorSecret: secret } });
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return { secret, otpauthUrl: authenticator.keyuri(user.email, 'AngoStay', secret) };
  }

  async confirmTwoFactor(userId: string, code: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!user.twoFactorSecret || !authenticator.verify({ token: code, secret: user.twoFactorSecret })) {
      throw new BadRequestException('Código inválido.');
    }
    await this.prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: true } });
    return { enabled: true };
  }

  async verifyTwoFactorChallenge(challengeToken: string, code: string) {
    let payload: { sub: string; type: string };
    try {
      payload = await this.jwt.verifyAsync(challengeToken, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Desafio expirado. Inicie sessão novamente.');
    }
    if (payload.type !== 'challenge') throw new UnauthorizedException();

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: payload.sub } });
    if (!user.twoFactorSecret || !authenticator.verify({ token: code, secret: user.twoFactorSecret })) {
      throw new UnauthorizedException('Código inválido.');
    }
    return this.issueTokens(user.id);
  }

  // ── Refresh tokens com rotação e deteção de reuso ──────────────────

  async refresh(refreshToken: string) {
    const tokenHash = sha256(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Sessão expirada.');
    }
    if (stored.revokedAt) {
      // Reuso de token já rodado → possível roubo: revoga a família inteira.
      await this.prisma.refreshToken.updateMany({
        where: { family: stored.family, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException('Sessão revogada por segurança.');
    }
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });
    return this.issueTokens(stored.userId, stored.family);
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: sha256(refreshToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { ok: true };
  }

  // ── Recuperação de senha ───────────────────────────────────────────

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      const raw = randomBytes(32).toString('hex');
      await this.prisma.notification.create({
        data: {
          userId: user.id,
          channel: 'EMAIL',
          template: 'password_reset',
          // O worker de notificações envia o link WEB_URL/recuperar-senha?token=...
          payload: { tokenHash: sha256(raw), expiresAt: Date.now() + 15 * 60_000 },
        },
      });
    }
    // Resposta uniforme, exista ou não a conta.
    return { message: 'Se a conta existir, enviámos um email com instruções.' };
  }

  async resetPassword(token: string, password: string) {
    const tokenHash = sha256(token);
    const pending = await this.prisma.notification.findFirst({
      where: { template: 'password_reset', payload: { path: ['tokenHash'], equals: tokenHash } },
      orderBy: { createdAt: 'desc' },
    });
    const payload = pending?.payload as { expiresAt?: number } | undefined;
    if (!pending || !payload?.expiresAt || payload.expiresAt < Date.now()) {
      throw new BadRequestException('Token inválido ou expirado.');
    }
    await this.prisma.user.update({
      where: { id: pending.userId },
      data: { passwordHash: await argon2.hash(password) },
    });
    await this.prisma.notification.delete({ where: { id: pending.id } });
    // Sessões antigas caem: revoga todos os refresh tokens.
    await this.prisma.refreshToken.updateMany({
      where: { userId: pending.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { message: 'Senha atualizada com sucesso.' };
  }

  // ── Emissão de tokens ──────────────────────────────────────────────

  private async issueTokens(userId: string, family?: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });
    const roles = user.roles.map((r) => r.role.name);

    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email, roles, type: 'access' },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: Number(process.env.JWT_ACCESS_TTL ?? 900) },
    );

    const refreshToken = randomBytes(48).toString('hex');
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: sha256(refreshToken),
        family: family ?? randomUUID(),
        expiresAt: new Date(Date.now() + Number(process.env.JWT_REFRESH_TTL ?? 2_592_000) * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, roles, avatarUrl: user.avatarUrl },
    };
  }
}
