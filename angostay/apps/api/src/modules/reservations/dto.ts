import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { ReservationStatus } from '@prisma/client';

export class CreateReservationDto {
  @IsString() @IsNotEmpty()
  propertyId: string;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @Type(() => Number) @IsInt() @Min(1) @Max(50)
  guests: number;

  @IsOptional() @IsString() @Length(3, 30)
  couponCode?: string;
}

export class ListReservationsQuery {
  @IsOptional() @IsIn(['guest', 'host'])
  role?: 'guest' | 'host';

  @IsOptional() @IsIn(Object.values(ReservationStatus))
  status?: ReservationStatus;
}

export class CancelReservationDto {
  @IsOptional() @IsString() @Length(0, 500)
  reason?: string;
}

export class CheckInDto {
  @IsString() @IsNotEmpty()
  qrToken: string;
}
