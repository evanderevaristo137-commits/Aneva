import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, Length, Min } from 'class-validator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { CouponsService } from './coupons.service';

class ValidateCouponDto {
  @IsString() @Length(3, 30)
  code: string;

  @Type(() => Number) @IsInt() @Min(0)
  totalKz: number;
}

@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly coupons: CouponsService) {}

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  validate(@CurrentUser() user: AuthUser, @Body() dto: ValidateCouponDto) {
    return this.coupons.preview(dto.code, user.id, dto.totalKz);
  }
}
