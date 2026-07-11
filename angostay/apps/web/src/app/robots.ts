import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://angostay.ao';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/perfil', '/reservas', '/pagamentos', '/mensagens', '/favoritos', '/anfitriao/dashboard'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
