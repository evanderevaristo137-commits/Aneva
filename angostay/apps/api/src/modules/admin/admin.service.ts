import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyStatus, ReportStatus, UserStatus, VerificationStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationQuery, paginated } from '../../common/pagination';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Utilizadores ───────────────────────────────────────────────────

  async listUsers(q: PaginationQuery & { status?: UserStatus; search?: string }) {
    const where = {
      ...(q.status ? { status: q.status } : {}),
      ...(q.search
        ? { OR: [{ name: { contains: q.search, mode: 'insensitive' as const } }, { email: { contains: q.search, mode: 'insensitive' as const } }] }
        : {}),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip: q.skip,
        take: q.limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, email: true, phone: true, status: true,
          createdAt: true, roles: { include: { role: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);
    return paginated(data, total, q);
  }

  async setUserStatus(actorId: string, userId: string, status: UserStatus) {
    const before = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!before) throw new NotFoundException('Utilizador não encontrado.');
    const after = await this.prisma.user.update({ where: { id: userId }, data: { status } });
    await this.audit(actorId, 'admin.user.status', 'User', userId, { status: before.status }, { status });
    return { id: after.id, status: after.status };
  }

  async reviewIdentity(actorId: string, verificationId: string, status: VerificationStatus, notes?: string) {
    const verification = await this.prisma.identityVerification.update({
      where: { id: verificationId },
      data: { status, reviewNotes: notes, reviewedById: actorId, reviewedAt: new Date() },
    });
    await this.audit(actorId, 'admin.identity.review', 'IdentityVerification', verificationId, null, { status });
    return verification;
  }

  // ── Imóveis / moderação ────────────────────────────────────────────

  async listProperties(q: PaginationQuery & { status?: PropertyStatus }) {
    const where = q.status ? { status: q.status } : {};
    const [data, total] = await this.prisma.$transaction([
      this.prisma.property.findMany({
        where,
        skip: q.skip,
        take: q.limit,
        orderBy: { createdAt: 'desc' },
        include: { host: { select: { name: true, email: true } }, city: true },
      }),
      this.prisma.property.count({ where }),
    ]);
    return paginated(data, total, q);
  }

  async moderateProperty(actorId: string, id: string, status: PropertyStatus, verified?: boolean) {
    const property = await this.prisma.property.update({
      where: { id },
      data: { status, ...(verified ? { verifiedAt: new Date() } : {}) },
    });
    await this.audit(actorId, 'admin.property.moderate', 'Property', id, null, { status, verified });
    return property;
  }

  // ── Denúncias ──────────────────────────────────────────────────────

  listReports(q: PaginationQuery & { status?: ReportStatus }) {
    return this.prisma.report.findMany({
      where: q.status ? { status: q.status } : {},
      skip: q.skip,
      take: q.limit,
      orderBy: { createdAt: 'desc' },
      include: { reporter: { select: { name: true, email: true } } },
    });
  }

  async resolveReport(actorId: string, id: string, status: ReportStatus, resolution?: string) {
    const report = await this.prisma.report.update({
      where: { id },
      data: { status, resolution, resolvedById: actorId, resolvedAt: new Date() },
    });
    await this.audit(actorId, 'admin.report.resolve', 'Report', id, null, { status });
    return report;
  }

  // ── Métricas / relatórios ──────────────────────────────────────────

  async metrics() {
    const [users, properties, reservations, gmv, commissions, openReports] =
      await this.prisma.$transaction([
        this.prisma.user.count({ where: { status: 'ACTIVE' } }),
        this.prisma.property.count({ where: { status: 'ACTIVE' } }),
        this.prisma.reservation.count({ where: { status: { in: ['CONFIRMED', 'CHECKED_IN', 'COMPLETED'] } } }),
        this.prisma.payment.aggregate({ where: { status: 'PAID' }, _sum: { amountKz: true } }),
        this.prisma.transaction.aggregate({ where: { type: 'COMMISSION' }, _sum: { amountKz: true } }),
        this.prisma.report.count({ where: { status: 'OPEN' } }),
      ]);
    return {
      activeUsers: users,
      activeProperties: properties,
      paidReservations: reservations,
      gmvKz: gmv._sum.amountKz ?? 0,
      commissionsKz: commissions._sum.amountKz ?? 0,
      openReports,
    };
  }

  listAuditLogs(q: PaginationQuery & { entity?: string }) {
    return this.prisma.auditLog.findMany({
      where: q.entity ? { entity: q.entity } : {},
      skip: q.skip,
      take: q.limit,
      orderBy: { createdAt: 'desc' },
      include: { actor: { select: { name: true, email: true } } },
    });
  }

  private audit(
    actorId: string,
    action: string,
    entity: string,
    entityId: string,
    before: unknown,
    after: unknown,
  ) {
    return this.prisma.auditLog.create({
      data: {
        actorId,
        action,
        entity,
        entityId,
        before: before === null ? undefined : (before as object),
        after: after === null ? undefined : (after as object),
      },
    });
  }
}
