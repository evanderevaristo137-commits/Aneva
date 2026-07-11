import { PaymentMethod } from '@prisma/client';

/**
 * Contrato de um provedor de pagamentos (padrão Strategy).
 * Cada método angolano/internacional implementa este contrato:
 * Multicaixa Express, Unitel Money, Afrimoney e gateway de cartões.
 */
export interface CheckoutInstructions {
  provider: string;
  /** Como o utilizador conclui o pagamento (push no telemóvel, redirect, etc.). */
  kind: 'MOBILE_PUSH' | 'REDIRECT' | 'USSD';
  redirectUrl?: string;
  reference?: string;
  message: string;
}

export interface WebhookResult {
  providerRef: string;
  status: 'PAID' | 'FAILED';
  amountKz: number;
}

export interface PaymentProvider {
  readonly method: PaymentMethod;
  readonly name: string;

  /** Inicia a cobrança junto do provedor externo. */
  createCharge(params: {
    reservationCode: string;
    amountKz: number;
    phone?: string;
  }): Promise<CheckoutInstructions>;

  /** Verifica a assinatura do webhook e normaliza o payload. */
  parseWebhook(rawBody: unknown, signature?: string): WebhookResult;
}
