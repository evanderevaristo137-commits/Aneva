'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { DashboardShell, USER_NAV } from '@/components/DashboardShell';

const CONVERSATIONS = [
  { id: 'c1', name: 'Domingos Cassoma', property: 'T2 moderno em Talatona', last: 'Perfeito, até dia 1!', unread: 0 },
  { id: 'c2', name: 'Guest House Serra da Chela', property: 'Guest House Lubango', last: 'O pequeno-almoço é servido das 7h às 10h.', unread: 2 },
];

const THREAD = [
  { from: 'them', text: 'Olá Marta! Obrigado pela reserva. O check-in é a partir das 14h.', time: '10:02' },
  { from: 'me', text: 'Olá! Chegamos por volta das 16h. Há estacionamento no condomínio?', time: '10:05' },
  { from: 'them', text: 'Sim, tem uma vaga incluída, junto à portaria. Basta indicar o código da reserva.', time: '10:07' },
  { from: 'me', text: 'Perfeito, até dia 1!', time: '10:08' },
];

/** Chat hóspede ↔ anfitrião — em produção liga ao WebSocket /chat da API. */
export default function MessagesPage() {
  const [active, setActive] = useState('c1');
  const [draft, setDraft] = useState('');

  return (
    <DashboardShell title="A minha conta" nav={USER_NAV} active="/mensagens">
      <h2 className="text-xl font-bold">Mensagens</h2>

      <div className="card mt-6 grid overflow-hidden md:grid-cols-[280px_1fr]">
        <aside className="border-b border-line md:border-b-0 md:border-r">
          {CONVERSATIONS.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setActive(conversation.id)}
              className={`flex w-full flex-col gap-0.5 border-b border-line p-4 text-left last:border-0 ${
                active === conversation.id ? 'bg-brand-100/60 dark:bg-brand-700/20' : 'hover:bg-line/40'
              }`}
            >
              <span className="flex items-center justify-between text-sm font-semibold">
                {conversation.name}
                {conversation.unread > 0 && (
                  <span className="rounded-full bg-accent-500 px-1.5 text-xs font-bold text-white">{conversation.unread}</span>
                )}
              </span>
              <span className="text-xs text-muted">{conversation.property}</span>
              <span className="truncate text-xs text-muted">{conversation.last}</span>
            </button>
          ))}
        </aside>

        <section className="flex min-h-[420px] flex-col" aria-label="Conversa">
          <div className="flex-1 space-y-3 p-4">
            {THREAD.map((message, i) => (
              <div key={i} className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    message.from === 'me'
                      ? 'rounded-br-md bg-brand-900 text-white dark:bg-brand-100 dark:text-brand-900'
                      : 'rounded-bl-md bg-line/60'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`mt-1 text-[10px] ${message.from === 'me' ? 'text-white/60 dark:text-brand-900/60' : 'text-muted'}`}>{message.time}</p>
                </div>
              </div>
            ))}
          </div>
          <form
            className="flex gap-2 border-t border-line p-3"
            onSubmit={(e) => {
              e.preventDefault();
              setDraft('');
            }}
          >
            <input
              className="input"
              placeholder="Escreva uma mensagem…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              aria-label="Mensagem"
            />
            <button type="submit" className="btn-primary !px-4" aria-label="Enviar">
              <Send size={16} />
            </button>
          </form>
        </section>
      </div>
    </DashboardShell>
  );
}
