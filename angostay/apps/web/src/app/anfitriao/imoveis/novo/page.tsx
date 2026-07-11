'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DashboardShell, HOST_NAV } from '@/components/DashboardShell';

const STEPS = ['Tipo', 'Localização', 'Fotos', 'Comodidades', 'Preço e regras', 'Rever'];
const TYPES = ['Apartamento', 'Casa', 'Quarto', 'Guest House', 'Pensão', 'Apart-hotel', 'Hotel'];
const AMENITIES = ['Wi-Fi', 'Gerador', 'Tanque de água', 'Ar condicionado', 'Cozinha equipada', 'Estacionamento', 'Piscina', 'Segurança 24h', 'TV por cabo', 'Máquina de lavar'];

/** Assistente de criação de anúncio em 6 passos. */
export default function NewPropertyPage() {
  const [step, setStep] = useState(0);

  return (
    <DashboardShell title="Painel do anfitrião" nav={HOST_NAV} active="/anfitriao/imoveis/novo">
      <h2 className="text-xl font-bold">Adicionar imóvel</h2>

      {/* Barra de progresso */}
      <ol className="mt-4 flex flex-wrap gap-2" aria-label="Passos">
        {STEPS.map((label, i) => (
          <li key={label}>
            <button
              onClick={() => setStep(i)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                i === step ? 'bg-accent-500 text-white'
                : i < step ? 'bg-brand-100 text-brand-900 dark:bg-brand-700/40 dark:text-white'
                : 'bg-line text-muted'
              }`}
              aria-current={i === step ? 'step' : undefined}
            >
              {i + 1}. {label}
            </button>
          </li>
        ))}
      </ol>

      <div className="card mt-6 p-6">
        {step === 0 && (
          <fieldset>
            <legend className="font-semibold">Que tipo de alojamento vai anunciar?</legend>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {TYPES.map((type) => (
                <label key={type} className="cursor-pointer rounded-xl border border-line p-4 text-sm font-medium hover:border-accent-500 has-[:checked]:border-accent-500 has-[:checked]:bg-accent-500/5">
                  <input type="radio" name="type" className="sr-only" /> {type}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Onde fica o imóvel?</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="province">Província</label>
                <select id="province" className="input">
                  {['Luanda', 'Benguela', 'Huíla', 'Namibe', 'Huambo', 'Cabinda'].map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="city">Cidade / distrito</label>
                <input id="city" className="input" placeholder="Ex.: Talatona" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="address">Endereço e ponto de referência</label>
              <input id="address" className="input" placeholder="Rua, condomínio, referência (ex.: junto ao Belas Shopping)" />
            </div>
            <div className="grid aspect-[3/1] place-items-center rounded-xl bg-brand-100 text-sm text-muted dark:bg-brand-700/20">
              📍 Arraste o pin no mapa para marcar a localização exata
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="font-semibold">Fotos do imóvel</h3>
            <p className="mt-1 text-sm text-muted">Mínimo 5 fotos. A primeira será a capa do anúncio.</p>
            <div className="mt-4 grid aspect-[3/1] cursor-pointer place-items-center rounded-xl border-2 border-dashed border-line text-center text-sm text-muted hover:border-accent-500">
              <span>📷 Arraste fotos para aqui ou <span className="font-semibold text-accent-600">procure no dispositivo</span><br />JPG/PNG até 10 MB — upload seguro via Cloudinary</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="font-semibold">Comodidades</legend>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {AMENITIES.map((amenity) => (
                <label key={amenity} className="flex cursor-pointer items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm has-[:checked]:border-accent-500">
                  <input type="checkbox" /> {amenity}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Preço e regras</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="price">Preço por noite (Kz)</label>
                <input id="price" type="number" min={1000} className="input" placeholder="45 000" />
              </div>
              <div>
                <label className="label" htmlFor="cleaning">Taxa de limpeza (Kz)</label>
                <input id="cleaning" type="number" min={0} className="input" placeholder="10 000" />
              </div>
              <div>
                <label className="label" htmlFor="guests">Máx. de hóspedes</label>
                <input id="guests" type="number" min={1} className="input" defaultValue={2} />
              </div>
              <div>
                <label className="label" htmlFor="policy">Política de cancelamento</label>
                <select id="policy" className="input">
                  <option>Flexível — reembolso total até 24 h antes</option>
                  <option>Moderada — total até 5 dias antes, depois 50%</option>
                  <option>Rígida — 50% até 7 dias antes</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="rules">Regras da casa</label>
              <textarea id="rules" rows={3} className="input" placeholder="Ex.: não são permitidas festas; silêncio após as 22 h." />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="text-center">
            <p className="text-4xl">🎉</p>
            <h3 className="mt-2 font-semibold">Tudo pronto para publicar</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              O anúncio será submetido para revisão. Depois de aprovado, pode pedir a
              <strong> verificação do imóvel</strong> (documento + visita) para ganhar o selo de confiança.
            </p>
            <Link href="/anfitriao/dashboard" className="btn-primary mt-6 inline-flex">Submeter para revisão</Link>
          </div>
        )}

        <div className="mt-6 flex justify-between border-t border-line pt-4">
          <button className="btn-ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            ← Anterior
          </button>
          <button className="btn-secondary" onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))} disabled={step === STEPS.length - 1}>
            Seguinte →
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
