import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString() @IsNotEmpty()
  reservationCode: string;

  @Type(() => Number) @IsInt() @Min(1) @Max(5)
  rating: number;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(5)
  cleanliness?: number;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(5)
  location?: number;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(5)
  value?: number;

  @IsString() @Length(10, 2000)
  comment: string;
}

export class ReplyDto {
  @IsString() @Length(2, 2000)
  reply: string;
}
