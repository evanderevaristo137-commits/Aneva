import type { MetadataRoute } from 'next';
import { CITIES, PROPERTIES } from '@/lib/mock-data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://angostay.ao';

/** Sitemap dinâmico — em produção lê imóveis ativos da API. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['', '/pesquisar', '/mapa', '/ajuda', '/contacto', '/sobre', '/termos', '/privacidade'].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.7,
    }),
  );

  const cityPages = CITIES.map((city) => ({
    url: `${SITE_URL}/pesquisar?cidade=${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const propertyPages = PROPERTIES.map((property) => ({
    url: `${SITE_URL}/imovel/${property.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...cityPages, ...propertyPages];
}
