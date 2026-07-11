import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        property: {
          include: { city: true, photos: { where: { isCover: true }, take: 1 } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post(':propertyId')
  async add(@CurrentUser() user: AuthUser, @Param('propertyId') propertyId: string) {
    await this.prisma.favorite.upsert({
      where: { userId_propertyId: { userId: user.id, propertyId } },
      update: {},
      create: { userId: user.id, propertyId },
    });
    return { favorited: true };
  }

  @Delete(':propertyId')
  async remove(@CurrentUser() user: AuthUser, @Param('propertyId') propertyId: string) {
    await this.prisma.favorite.deleteMany({ where: { userId: user.id, propertyId } });
    return { favorited: false };
  }
}
