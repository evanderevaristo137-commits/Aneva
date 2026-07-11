import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { CancelReservationDto, CheckInDto, CreateReservationDto, ListReservationsQuery } from './dto';
import { ReservationsService } from './reservations.service';

@ApiTags('reservations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservations: ReservationsService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateReservationDto) {
    return this.reservations.create(user.id, dto);
  }

  @Get()
  list(@CurrentUser() user: AuthUser, @Query() q: ListReservationsQuery) {
    return this.reservations.listMine(user.id, q.role ?? 'guest', q.status);
  }

  @Get(':code')
  byCode(@CurrentUser() user: AuthUser, @Param('code') code: string) {
    return this.reservations.findByCode(user.id, code);
  }

  @Post(':code/cancel')
  cancel(@CurrentUser() user: AuthUser, @Param('code') code: string, @Body() dto: CancelReservationDto) {
    return this.reservations.cancel(user.id, code, dto.reason);
  }

  @Post(':code/check-in')
  checkIn(@CurrentUser() user: AuthUser, @Param('code') code: string, @Body() dto: CheckInDto) {
    return this.reservations.checkIn(user.id, code, dto.qrToken);
  }
}
