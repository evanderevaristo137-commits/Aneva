import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://angostay.ao';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'AngoStay — Reservas de alojamento em Angola',
    template: '%s · AngoStay',
  },
  description:
    'Encontre e reserve casas, apartamentos, guest houses e hotéis em Angola. Pague com Multicaixa Express, Unitel Money, Afrimoney ou cartão.',
  openGraph: {
    type: 'website',
    siteName: 'AngoStay',
    locale: 'pt_AO',
    url: SITE_URL,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/', languages: { pt: '/', en: '/?lang=en', fr: '/?lang=fr' } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        {/* Aplica o tema antes da hidratação para evitar flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.theme??(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.classList.toggle('dark',t==='dark')}catch{}`,
          }}
        />
        {/* Schema.org: Organization + WebSite com SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                { '@type': 'Organization', name: 'AngoStay', url: SITE_URL, logo: `${SITE_URL}/icon.svg` },
                {
                  '@type': 'WebSite',
                  name: 'AngoStay',
                  url: SITE_URL,
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: `${SITE_URL}/pesquisar?cidade={search_term_string}`,
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-accent-500 focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar para o conteúdo
        </a>
        <Header />
        <main id="conteudo" className="min-h-[70vh]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
