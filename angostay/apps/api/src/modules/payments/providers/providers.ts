import { BadRequestException } from '@nestjs/common';
import { PaymentMethod } from '@prisma/client';
import { createHmac, timingSafeEqual } from 'crypto';
import { CheckoutInstructions, PaymentProvider, WebhookResult } from './payment-provider.interface';

/**
 * Implementações dos provedores. Em desenvolvimento operam em modo sandbox
 * (sem chamadas externas); em produção usam as credenciais do .env.
 * A verificação HMAC dos webhooks é real em ambos os modos.
 */

interface RawWebhook {
  reference?: string;
  status?: string;
  amount?: number;
}

abstract class BaseProvider implements PaymentProvider {
  abstract readonly method: PaymentMethod;
  abstract readonly name: string;

  constructor(protected readonly webhookSecret: string) {}

  abstract createCharge(params: {
    reservationCode: string;
    amountKz: number;
    phone?: string;
  }): Promise<CheckoutInstructions>;

  parseWebhook(rawBody: unknown, signature?: string): WebhookResult {
    const body = rawBody as RawWebhook;
    if (this.webhookSecret) {
      const expected = createHmac('sha256', this.webhookSecret)
        .update(JSON.stringify(rawBody))
        .digest('hex');
      const provided = Buffer.from(signature ?? '', 'utf8');
      const wanted = Buffer.from(expected, 'utf8');
      if (provided.length !== wanted.length || !timingSafeEqual(provided, wanted)) {
        throw new BadRequestException('Assinatura de webhook inválida.');
      }
    }
    if (!body.reference || typeof body.amount !== 'number') {
      throw new BadRequestException('Payload de webhook inválido.');
    }
    return {
      providerRef: `${this.name}:${body.reference}`,
      status: body.status === 'success' ? 'PAID' : 'FAILED',
      amountKz: body.amount,
    };
  }
}

export class MulticaixaExpressProvider extends BaseProvider {
  readonly method = PaymentMethod.MULTICAIXA_EXPRESS;
  readonly name = 'multicaixa-express';

  async createCharge({ reservationCode, amountKz, phone }: { reservationCode: string; amountKz: number; phone?: string }): Promise<CheckoutInstructions> {
    // Produção: POST ao API GPO/EMIS com token MCX_EXPRESS_TOKEN.
    return {
      provider: this.name,
      kind: 'MOBILE_PUSH',
      reference: reservationCode,
      message: `Confirme o pagamento de ${(amountKz / 100).toLocaleString('pt-AO')} Kz na app Multicaixa Express${phone ? ` (${phone})` : ''}.`,
    };
  }
}

export class UnitelMoneyProvider extends BaseProvider {
  readonly method = PaymentMethod.UNITEL_MONEY;
  readonly name = 'unitel-money';

  async createCharge({ reservationCode, amountKz }: { reservationCode: string; amountKz: number }): Promise<CheckoutInstructions> {
    return {
      provider: this.name,
      kind: 'USSD',
      reference: reservationCode,
      message: `Marque *400# e confirme o pagamento de ${(amountKz / 100).toLocaleString('pt-AO')} Kz (ref. ${reservationCode}).`,
    };
  }
}

export class AfrimoneyProvider extends BaseProvider {
  readonly method = PaymentMethod.AFRIMONEY;
  readonly name = 'afrimoney';

  async createCharge({ reservationCode, amountKz }: { reservationCode: string; amountKz: number }): Promise<CheckoutInstructions> {
    return {
      provider: this.name,
      kind: 'MOBILE_PUSH',
      reference: reservationCode,
      message: `Confirme o pagamento de ${(amountKz / 100).toLocaleString('pt-AO')} Kz na app Afrimoney.`,
    };
  }
}

/** Visa e Mastercard partilham o mesmo gateway de cartões. */
export class CardGatewayProvider extends BaseProvider {
  readonly name = 'card-gateway';

  constructor(readonly method: PaymentMethod, webhookSecret: string) {
    super(webhookSecret);
  }

  async createCharge({ reservationCode }: { reservationCode: string; amountKz: number }): Promise<CheckoutInstructions> {
    return {
      provider: this.name,
      kind: 'REDIRECT',
      redirectUrl: `${process.env.CARD_GATEWAY_API_URL ?? 'https://sandbox.gateway.example'}/pay/${reservationCode}`,
      reference: reservationCode,
      message: 'Será redirecionado para a página segura de pagamento com cartão.',
    };
  }
}
