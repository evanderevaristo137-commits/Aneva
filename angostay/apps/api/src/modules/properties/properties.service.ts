import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PropertyStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { paginated } from '../../common/pagination';
import { AddPhotoDto, BlockDatesDto, CreatePropertyDto, SearchPropertiesQuery, UpdatePropertyDto } from './dto';

const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Pesquisa pública ───────────────────────────────────────────────

  async search(q: SearchPropertiesQuery) {
    const where: Prisma.PropertyWhereInput = {
      status: PropertyStatus.ACTIVE,
      deletedAt: null,
      ...(q.city ? { city: { slug: q.city } } : {}),
      ...(q.type ? { type: q.type } : {}),
      ...(q.guests ? { maxGuests: { gte: q.guests } } : {}),
      ...(q.verified ? { verifiedAt: { not: null } } : {}),
      ...(q.minPrice || q.maxPrice
        ? { basePriceKz: { gte: q.minPrice ?? 0, ...(q.maxPrice ? { lte: q.maxPrice } : {}) } }
        : {}),
    };

    if (q.amenities) {
      const codes = q.amenities.split(',').filter(Boolean);
      where.AND = codes.map((code) => ({ amenities: { some: { amenity: { code } } } }));
    }

    if (q.bbox) {
      const [swLat, swLng, neLat, neLng] = q.bbox.split(',').map(Number);
      if ([swLat, swLng, neLat, neLng].every((n) => Number.isFinite(n))) {
        where.lat = { gte: swLat, lte: neLat };
        where.lng = { gte: swLng, lte: neLng };
      }
    }

    // Exclui imóveis com reservas ativas ou bloqueios sobrepostos às datas pedidas.
    if (q.checkIn && q.checkOut) {
      const checkIn = new Date(q.checkIn);
      const checkOut = new Date(q.checkOut);
      where.reservations = {
        none: {
          status: { in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] },
          checkIn: { lt: checkOut },
          checkOut: { gt: checkIn },
        },
      };
      where.blocks = { none: { startDate: { lt: checkOut }, endDate: { gt: checkIn } } };
    }

    const orderBy: Prisma.PropertyOrderByWithRelationInput =
      q.sort === 'price_asc' ? { basePriceKz: 'asc' }
      : q.sort === 'price_desc' ? { basePriceKz: 'desc' }
      : q.sort === 'rating' ? { ratingAvg: 'desc' }
      : { createdAt: 'desc' };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.property.findMany({
        where,
        orderBy,
        skip: q.skip,
        take: q.limit,
        include: {
          city: { include: { province: true } },
          photos: { where: { isCover: true }, take: 1 },
        },
      }),
      this.prisma.property.count({ where }),
    ]);
    return paginated(data, total, q);
  }

  async findBySlug(slug: string) {
    const property = await this.prisma.property.findFirst({
      where: { slug, status: PropertyStatus.ACTIVE, deletedAt: null },
      include: {
        city: { include: { province: true } },
        photos: { orderBy: { position: 'asc' } },
        amenities: { include: { amenity: true } },
        host: { select: { id: true, name: true, avatarUrl: true, createdAt: true } },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { author: { select: { name: true, avatarUrl: true } } },
        },
      },
    });
    if (!property) throw new NotFoundException('Imóvel não encontrado.');
    return property;
  }

  /** Datas indisponíveis (reservas ativas + bloqueios) para o calendário. */
  async availability(propertyId: string) {
    const [reservations, blocks] = await Promise.all([
      this.prisma.reservation.findMany({
        where: { propertyId, status: { in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] } },
        select: { checkIn: true, checkOut: true },
      }),
      this.prisma.availabilityBlock.findMany({
        where: { propertyId },
        select: { startDate: true, endDate: true },
      }),
    ]);
    return {
      unavailable: [
        ...reservations.map((r) => ({ start: r.checkIn, end: r.checkOut })),
        ...blocks.map((b) => ({ start: b.startDate, end: b.endDate })),
      ],
    };
  }

  // ── Gestão pelo anfitrião ──────────────────────────────────────────

  async create(hostId: string, dto: CreatePropertyDto) {
    const city = await this.prisma.city.findUniqueOrThrow({ where: { id: dto.cityId } });
    const { amenityCodes, ...data } = dto;
    const amenities = amenityCodes?.length
      ? await this.prisma.amenity.findMany({ where: { code: { in: amenityCodes } } })
      : [];

    return this.prisma.property.create({
      data: {
        ...data,
        hostId,
        slug: `${slugify(dto.title)}-${city.slug}-${Date.now().toString(36)}`,
        amenities: { create: amenities.map((a) => ({ amenityId: a.id })) },
      },
    });
  }

  async update(hostId: string, id: string, dto: UpdatePropertyDto, isAdmin = false) {
    await this.assertOwnership(hostId, id, isAdmin);
    const { amenityCodes, cityId, ...data } = dto;
    void cityId; // cidade não é alterável após criação (slug e SEO)

    if (amenityCodes) {
      const amenities = await this.prisma.amenity.findMany({ where: { code: { in: amenityCodes } } });
      await this.prisma.propertyAmenity.deleteMany({ where: { propertyId: id } });
      await this.prisma.propertyAmenity.createMany({
        data: amenities.map((a) => ({ propertyId: id, amenityId: a.id })),
      });
    }
    return this.prisma.property.update({ where: { id }, data });
  }

  async publish(hostId: string, id: string) {
    await this.assertOwnership(hostId, id);
    return this.prisma.property.update({
      where: { id },
      data: { status: PropertyStatus.PENDING_REVIEW },
    });
  }

  async remove(hostId: string, id: string, isAdmin = false) {
    await this.assertOwnership(hostId, id, isAdmin);
    return this.prisma.property.update({
      where: { id },
      data: { status: PropertyStatus.SUSPENDED, deletedAt: new Date() },
    });
  }

  async addPhoto(hostId: string, id: string, dto: AddPhotoDto) {
    await this.assertOwnership(hostId, id);
    const count = await this.prisma.photo.count({ where: { propertyId: id } });
    return this.prisma.photo.create({
      data: { propertyId: id, url: dto.url, alt: dto.alt, isCover: dto.isCover ?? count === 0, position: count },
    });
  }

  async blockDates(hostId: string, id: string, dto: BlockDatesDto) {
    await this.assertOwnership(hostId, id);
    return this.prisma.availabilityBlock.create({
      data: {
        propertyId: id,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        reason: dto.reason,
      },
    });
  }

  myProperties(hostId: string) {
    return this.prisma.property.findMany({
      where: { hostId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { photos: { where: { isCover: true }, take: 1 }, city: true },
    });
  }

  listCities() {
    return this.prisma.city.findMany({ include: { province: true }, orderBy: { name: 'asc' } });
  }

  listAmenities() {
    return this.prisma.amenity.findMany({ orderBy: { namePt: 'asc' } });
  }

  /** Anti-IDOR: só o dono (ou admin) gere o imóvel. */
  private async assertOwnership(userId: string, propertyId: string, isAdmin = false) {
    const property = await this.prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Imóvel não encontrado.');
    if (!isAdmin && property.hostId !== userId) {
      throw new ForbiddenException('Sem permissão sobre este imóvel.');
    }
  }
}
