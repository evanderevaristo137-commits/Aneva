import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { AddPhotoDto, BlockDatesDto, CreatePropertyDto, SearchPropertiesQuery, UpdatePropertyDto } from './dto';
import { PropertiesService } from './properties.service';

@ApiTags('properties')
@Controller()
export class PropertiesController {
  constructor(private readonly properties: PropertiesService) {}

  // ── Público ────────────────────────────────────────────────────────

  @Get('properties')
  search(@Query() query: SearchPropertiesQuery) {
    return this.properties.search(query);
  }

  @Get('cities')
  cities() {
    return this.properties.listCities();
  }

  @Get('amenities')
  amenities() {
    return this.properties.listAmenities();
  }

  @Get('properties/:idOrSlug/availability')
  availability(@Param('idOrSlug') id: string) {
    return this.properties.availability(id);
  }

  @Get('properties/:slug')
  bySlug(@Param('slug') slug: string) {
    return this.properties.findBySlug(slug);
  }

  // ── Anfitrião ──────────────────────────────────────────────────────

  @Get('host/properties')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST', 'ADMIN')
  @ApiBearerAuth()
  mine(@CurrentUser() user: AuthUser) {
    return this.properties.myProperties(user.id);
  }

  @Post('properties')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST', 'ADMIN')
  @ApiBearerAuth()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreatePropertyDto) {
    return this.properties.create(user.id, dto);
  }

  @Patch('properties/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdatePropertyDto) {
    return this.properties.update(user.id, id, dto, user.roles.includes('ADMIN'));
  }

  @Post('properties/:id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  publish(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.properties.publish(user.id, id);
  }

  @Delete('properties/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.properties.remove(user.id, id, user.roles.includes('ADMIN'));
  }

  @Post('properties/:id/photos')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  addPhoto(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: AddPhotoDto) {
    return this.properties.addPhoto(user.id, id, dto);
  }

  @Post('properties/:id/blocks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  blockDates(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: BlockDatesDto) {
    return this.properties.blockDates(user.id, id, dto);
  }
}
