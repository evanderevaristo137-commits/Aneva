import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { CancellationPolicy, PropertyType } from '@prisma/client';
import { PaginationQuery } from '../../common/pagination';

export class SearchPropertiesQuery extends PaginationQuery {
  @IsOptional() @IsString()
  city?: string; // slug da cidade

  @IsOptional() @IsDateString()
  checkIn?: string;

  @IsOptional() @IsDateString()
  checkOut?: string;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(20)
  guests?: number;

  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  minPrice?: number; // centavos

  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  maxPrice?: number;

  @IsOptional() @IsEnum(PropertyType)
  type?: PropertyType;

  @IsOptional() @IsString()
  amenities?: string; // códigos separados por vírgula

  @IsOptional() @Type(() => Boolean) @IsBoolean()
  verified?: boolean;

  /** Bounding box do mapa: "swLat,swLng,neLat,neLng" */
  @IsOptional() @IsString()
  bbox?: string;

  @IsOptional() @IsString()
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'recent';
}

export class CreatePropertyDto {
  @IsString() @Length(1, 40)
  cityId: string;

  @IsEnum(PropertyType)
  type: PropertyType;

  @IsString() @Length(10, 120)
  title: string;

  @IsString() @Length(40, 5000)
  description: string;

  @IsString() @Length(3, 200)
  address: string;

  @IsNumber() @Min(-90) @Max(90)
  lat: number;

  @IsNumber() @Min(-180) @Max(180)
  lng: number;

  @IsInt() @Min(1) @Max(50)
  maxGuests: number;

  @IsInt() @Min(0) @Max(30)
  bedrooms: number;

  @IsInt() @Min(1) @Max(50)
  beds: number;

  @IsInt() @Min(1) @Max(30)
  bathrooms: number;

  @IsInt() @Min(100_000) // mínimo 1.000 Kz/noite
  basePriceKz: number;

  @IsOptional() @IsInt() @Min(0)
  cleaningFeeKz?: number;

  @IsOptional() @IsEnum(CancellationPolicy)
  cancellationPolicy?: CancellationPolicy;

  @IsOptional() @IsString() @Length(0, 2000)
  houseRules?: string;

  @IsOptional() @IsArray() @ArrayMaxSize(30) @IsString({ each: true })
  amenityCodes?: string[];
}

export class UpdatePropertyDto extends CreatePropertyDto {}

export class AddPhotoDto {
  @IsString()
  url: string;

  @IsOptional() @IsString() @Length(0, 200)
  alt?: string;

  @IsOptional() @IsBoolean()
  isCover?: boolean;
}

export class BlockDatesDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional() @IsString() @Length(0, 200)
  reason?: string;
}
