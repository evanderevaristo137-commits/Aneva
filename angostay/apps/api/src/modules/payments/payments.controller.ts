import { Body, Controller, Get, Headers, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaymentsService } from './payments.service';

class CheckoutDto {
  @IsString() @IsNotEmpty()
  reservationCode: string;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional() @IsString()
  phone?: string;
}

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  checkout(@CurrentUser() user: AuthUser, @Body() dto: CheckoutDto) {
    return this.payments.checkout(user.id, dto.reservationCode, dto.method, dto.phone);
  }

  /** Webhook público — segurança por assinatura HMAC, não por sessão. */
  @Post('webhook/:provider')
  @HttpCode(200)
  webhook(
    @Param('provider') provider: string,
    @Body() body: unknown,
    @Headers('x-signature') signature?: string,
  ) {
    return this.payments.handleWebhook(provider, body, signature);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  list(@CurrentUser() user: AuthUser) {
    return this.payments.listMine(user.id);
  }
}
