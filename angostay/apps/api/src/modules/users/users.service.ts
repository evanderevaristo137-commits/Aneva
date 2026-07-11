import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitIdentityDto, UpdateProfileDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        roles: { include: { role: true } },
        identityVerifications: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
    const { passwordHash, twoFactorSecret, ...safe } = user;
    void passwordHash;
    void twoFactorSecret;
    return { ...safe, roles: user.roles.map((r) => r.role.name) };
  }

  updateMe(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: { id: true, name: true, phone: true, bio: true, avatarUrl: true, locale: true },
    });
  }

  /** Soft-delete LGPD/GDPR: anonimização definitiva corre num job após 30 dias. */
  async deleteMe(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: 'DELETED', deletedAt: new Date() },
    });
    return { message: 'Conta marcada para eliminação. Será anonimizada em 30 dias.' };
  }

  /** Exportação de dados pessoais (direito de portabilidade). */
  async exportMyData(userId: string) {
    const [user, reservations, reviews, favorites] = await Promise.all([
      this.me(userId),
      this.prisma.reservation.findMany({ where: { guestId: userId } }),
      this.prisma.review.findMany({ where: { authorId: userId } }),
      this.prisma.favorite.findMany({ where: { userId } }),
    ]);
    return { user, reservations, reviews, favorites, exportedAt: new Date().toISOString() };
  }

  submitIdentity(userId: string, dto: SubmitIdentityDto) {
    return this.prisma.identityVerification.create({
      data: {
        userId,
        docType: dto.docType,
        docNumberEnc: dto.docNumber, // em produção: cifrado antes de persistir
        docPhotoUrl: dto.docPhotoUrl,
        selfieUrl: dto.selfieUrl,
      },
      select: { id: true, status: true, createdAt: true },
    });
  }

  async publicProfile(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, status: 'ACTIVE' },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        identityVerifications: { where: { status: 'APPROVED' }, select: { id: true }, take: 1 },
        properties: {
          where: { status: 'ACTIVE' },
          select: { slug: true, title: true, ratingAvg: true, ratingCount: true },
        },
      },
    });
    if (!user) throw new NotFoundException('Utilizador não encontrado.');
    const { identityVerifications, ...rest } = user;
    return { ...rest, identityVerified: identityVerifications.length > 0 };
  }
}
