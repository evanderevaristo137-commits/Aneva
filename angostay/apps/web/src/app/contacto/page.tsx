import type { Metadata } from 'next';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Fale com a equipa AngoStay — email, telefone, WhatsApp ou formulário.',
};

export default function ContactPage() {
  return (
    <div className="container-page grid max-w-4xl gap-10 py-12 lg:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold">Fale connosco</h1>
        <p className="mt-2 text-muted">Suporte em português, inglês e francês, todos os dias das 8h às 22h (WAT).</p>
        <ul className="mt-8 space-y-4 text-sm">
          <li className="flex items-center gap-3"><MessageCircle className="text-accent-500" size={18} /> WhatsApp: +244 900 000 000</li>
          <li className="flex items-center gap-3"><Phone className="text-accent-500" size={18} /> Telefone: +244 222 000 000</li>
          <li className="flex items-center gap-3"><Mail className="text-accent-500" size={18} /> suporte@angostay.ao</li>
          <li className="flex items-center gap-3"><MapPin className="text-accent-500" size={18} /> Talatona, Luanda — Angola</li>
        </ul>
      </div>

      <form className="card space-y-4 p-6">
        <div>
          <label className="label" htmlFor="name">Nome</label>
          <input id="name" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="subject">Assunto</label>
          <select id="subject" className="input">
            <option>Dúvida sobre reserva</option>
            <option>Pagamentos e reembolsos</option>
            <option>Sou anfitrião</option>
            <option>Denunciar um problema</option>
            <option>Outro</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="message">Mensagem</label>
          <textarea id="message" rows={5} required className="input" />
        </div>
        <button type="submit" className="btn-primary w-full">Enviar mensagem</button>
      </form>
    </div>
  );
}
