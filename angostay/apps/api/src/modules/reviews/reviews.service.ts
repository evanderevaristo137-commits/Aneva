import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Só quem completou a estadia pode avaliar — uma avaliação por reserva. */
  async create(userId: string, dto: CreateReviewDto) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { code: dto.reservationCode },
      include: { review: true },
    });
    if (!reservation) throw new NotFoundException('Reserva não encontrada.');
    if (reservation.guestId !== userId) throw new ForbiddenException();
    if (reservation.status !== 'COMPLETED' && reservation.status !== 'CHECKED_IN') {
      throw new BadRequestException('Só pode avaliar após a estadia.');
    }
    if (reservation.review) throw new BadRequestException('Esta reserva já foi avaliada.');

    const review = await this.prisma.review.create({
      data: {
        reservationId: reservation.id,
        propertyId: reservation.propertyId,
        authorId: userId,
        rating: dto.rating,
        cleanliness: dto.cleanliness,
        location: dto.location,
        value: dto.value,
        comment: dto.comment,
      },
    });

    // Atualiza agregados desnormalizados do imóvel.
    const agg = await this.prisma.review.aggregate({
      where: { propertyId: reservation.propertyId },
      _avg: { rating: true },
      _count: true,
    });
    await this.prisma.property.update({
      where: { id: reservation.propertyId },
      data: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count },
    });
    return review;
  }

  async listForProperty(propertyId: string) {
    return this.prisma.review.findMany({
      where: { propertyId },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true, avatarUrl: true } } },
    });
  }

  async reply(hostId: string, reviewId: string, reply: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { property: true },
    });
    if (!review) throw new NotFoundException('Avaliação não encontrada.');
    if (review.property.hostId !== hostId) throw new ForbiddenException();
    return this.prisma.review.update({ where: { id: reviewId }, data: { hostReply: reply } });
  }
}
