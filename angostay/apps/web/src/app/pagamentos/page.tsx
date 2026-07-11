import type { Metadata } from 'next';
import { DashboardShell, USER_NAV } from '@/components/DashboardShell';
import { kz } from '@/lib/format';

export const metadata: Metadata = { title: 'Pagamentos', robots: { index: false } };

const PAYMENTS = [
  { id: '1', date: '12 Jul 2026', method: 'Multicaixa Express', desc: 'Reserva AS-3F7K2M — T2 Talatona', amount: 20_900_000, status: 'Pago' },
  { id: '2', date: '08 Jun 2026', method: 'Unitel Money', desc: 'Reserva AS-9QW1ZX — Guest House Lubango', amount: 4_840_000, status: 'Pago' },
  { id: '3', date: '02 Jun 2026', method: 'Visa •• 4242', desc: 'Reserva AS-1BC3DD — cancelada', amount: -6_000_000, status: 'Reembolsado' },
];

export default function PaymentsPage() {
  return (
    <DashboardShell title="A minha conta" nav={USER_NAV} active="/pagamentos">
      <h2 className="text-xl font-bold">Pagamentos</h2>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="p-4 font-medium">Data</th>
              <th className="p-4 font-medium">Descrição</th>
              <th className="p-4 font-medium">Método</th>
              <th className="p-4 text-right font-medium">Valor</th>
              <th className="p-4 font-medium">Estado</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {PAYMENTS.map((payment) => (
              <tr key={payment.id} className="border-b border-line last:border-0">
                <td className="p-4 whitespace-nowrap">{payment.date}</td>
                <td className="p-4">{payment.desc}</td>
                <td className="p-4 whitespace-nowrap">{payment.method}</td>
                <td className={`p-4 text-right font-semibold tabular-nums ${payment.amount < 0 ? 'text-emerald-600' : ''}`}>
                  {payment.amount < 0 ? `+${kz(-payment.amount)}` : kz(payment.amount)}
                </td>
                <td className="p-4">{payment.status}</td>
                <td className="p-4"><button className="text-xs font-semibold text-accent-600 hover:underline">Recibo</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="card mt-6 p-6">
        <h3 className="font-semibold">Métodos de pagamento</h3>
        <p className="mt-1 text-sm text-muted">Métodos disponíveis na AngoStay:</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {['Multicaixa Express', 'Unitel Money', 'Afrimoney', 'Visa', 'Mastercard'].map((method) => (
            <span key={method} className="rounded-full border border-line px-3 py-1">{method}</span>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
